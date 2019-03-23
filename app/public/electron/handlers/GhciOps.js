const { webContents } = require("electron");
const { IpcResponder } = require("../utils/IpcResponder");
const { FileUtils } = require("../utils/FileUtils");
const { GhciWrapper } = require("../utils/GhciWrapper");

// GHCI process (essentially a private static field)
let GHCI_PROCESS = new GhciWrapper();

// handles GHCI operation requests (automatically responds)
class GhciOps{
    // executes haskell code in the REPL
    // @param evt   event object for responding
    // @param str   haskell code to execute
    static executeCode(evt, {str=null}){
        // must have haskell code to execute 
        if(!str){
            let err = "No code provided (str is null or empty.)";
            IpcResponder.respond(evt, "ghci", {err: err.message});
            return;
        }

        // ghci must be working 
        this.ghciSafeRun(evt, () => {
            // execute the code
            // do not respond (using evt) because response is async
            // (handled with the wrapper's auto stdout listeners)
            GHCI_PROCESS.responseEvt = evt;
            GHCI_PROCESS.send(str);
        });
    }

    // restarts the ghci process with a file to load
    // @param evt   event object for responding
    // @param str   haskell file to run 
    // @param save  auto save the file 
    static executeFile(evt, {path=null, str=""}){
        // must have haskell file to execute 
        if(!path){
            let err = "No file path provided (path is null or empty.)";
            IpcResponder.respond(evt, "ghci", {err: err.message});
            return;
        }

        // fix problem where path folder had spaces
        // (don't save with this path, just special for ghci)
        let runPath = path.includes(" ") ? `\"${path}\"` : path;

        // ghci must be working 
        this.ghciSafeRun(evt, () => {
            // load and run the file 
            // do not respond (using evt) because response is async
            // (handled with the wrapper's auto stdout listeners)
            if(str){
                // file changed
                FileUtils.writeFile(path, str)
                    .then(() => {
                        // file updated
                        GHCI_PROCESS.responseEvt = evt;
                        IpcResponder.respond(evt, "file-write", {path});

                        // now run
                        GHCI_PROCESS.load(runPath);
                    })
                    .catch(err => {
                        // file write error (don't run)
                        IpcResponder.respond(evt, "file-write", {err: err.message, path});
                    });
            }
            else{
                // file not changed
                GHCI_PROCESS.responseEvt = evt;
                GHCI_PROCESS.load(runPath);
            }
        });
    }

    // clears the GHCI REPL 
    // @param evt   event object for responding
    static clear(evt){
        // ghci must be working 
        this.ghciSafeRun(evt, () => {
            GHCI_PROCESS.clear();
            IpcResponder.respond(evt, "ghci-clear");
        });
    }

    // gets the initial buffer data
    // @param evt   event object for responding 
    static init(evt){
        // ghci must be working 
        this.ghciSafeRun(evt, () => {
            // get buffer text
            GHCI_PROCESS.init(str => {
                // send the text ("ghci version...")
                IpcResponder.respond(evt, "ghci", {str});
            });
        });
    }


    // checks if ghci is available, responds if its not 
    // @param evt   event object for respnding 
    // @param task  function to execute if ghci is working
    static ghciSafeRun(evt, task){
        if(!GHCI_PROCESS.isAvailable){
            // ghci is down, respond
            IpcResponder.respondNoGhci(evt);
            return false;
        }
        
        // ghci is running
        try{
            task();
        }
        catch(err){
            IpcResponder.respond(evt, "ghci-error", {err: err.message});
        }
    }

    // handles setup error from child process (informs renderer)
    static handleSetupError(evt){
        // tell all windows ghci is broken (there will never a response object at this point)
        webContents.getAllWebContents().forEach(resEvt => {
            IpcResponder.respond(resEvt, "ghci-error", {err: evt.message || "GHCi setup error."})
        });
    }

    // handles child process output (forwards to renderer)
    static handleOutput(evt){
        // response info includes response event object and output string 
        IpcResponder.respond(GHCI_PROCESS.responseEvt, "ghci", {str: evt.str});
    }
}

// attach listeners
GHCI_PROCESS.on("setup-error", err => GhciOps.handleSetupError(err));
GHCI_PROCESS.on("output", str => GhciOps.handleOutput(str));

module.exports = { GhciOps };