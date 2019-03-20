const { webContents } = require("electron");
const { spawn } = require("child_process");
const { IpcResponder } = require("../utils/IpcResponder");
const { FileUtils } = require("../utils/FileUtils");

// wrapper class for forked GHCI child process 
class GhciWrapper{
    constructor(path=null){
        // ghci child process (setup later)
        this.ghci = null;

        // buffer to hold ghci data that arrives before first request
        // (need request object to respond)
        this.responseBuf = [];

        // last request event (used to respond)
        this.responseEvt = null;

        // GHCI child process
        this.setupGhciChildProcess(path, err => {
            // error setting up ghci child process
            // (most likely haskell platform is not installed)
            // inform renderer process that ghci is not going to work 
            webContents.getAllWebContents().forEach(evt => {
                IpcResponder.respond(evt, "ghci-error", {err: err.message});
            });
        });
    }

    // setups ghci child with error callback
    // @param callback  callback function for error 
    setupGhciChildProcess(path, callback){
        // mac hates 'ghci'
        let ghciPath = process.platform === "darwin" ? "/usr/local/bin/ghci" : "ghci";

        // attempt to create ghci child process
        let ghciProcess;
        try{
            ghciProcess = path ? spawn(ghciPath, [path]) : spawn(ghciPath);
        }
        catch(err){
            callback(err);
            return;
        }

        this.ghci = ghciProcess;

        // handle ghci output 
        this.ghci.stdout.on("data", buf => {
            // get the output as a string
            let str = buf.toString();
            
            // respond if there is a response object
            if(this.responseEvt){
                // any response data in buffer that needs to be sent? 
                if(this.responseBuf.length){
                    // yes, send it first and clear buffer 
                    IpcResponder.respond(this.responseEvt, "ghci", {str: this.responseBuf.join("\n")});
                    this.responseBuf = [];
                }

                // response object - send response
                IpcResponder.respond(this.responseEvt, "ghci", {str});
            }
            else{
                // no response object yet - store in buffer 
                this.responseBuf.push(str);
            }
        });
        this.ghci.stdout.on("error", err => {
            // send error message if one exists 
            if(this.responseEvt){
                IpcResponder.respond(this.responseEvt, "ghci", {err: err.toString()});
            }
        });

        // handle ghci error 
        this.ghci.stderr.on("data", buf => {
            // send error message if one exists 
            if(this.responseEvt){
                IpcResponder.respond(this.responseEvt, "ghci", {err: buf.toString()});
            }
        });
        this.ghci.stderr.on("error", err => {
            // send error message if one exists 
            if(this.responseEvt){
                IpcResponder.respond(this.responseEvt, "ghci", {err: err.toString()});
            }
        });
    }

    // sends code to the GHCI process 
    // @param code      haskell code to execute in REPL
    // @param callback  callback function 
    send(code, callback){
        this.ghci.stdin.write(code + "\n", callback);
    }

    // clears the GHCI process
    clear(){
        // different clear messages depending on OS (of course -_-)
        let clear = process.platform === "win32" ? ":!cls" : ":!clear";
        this.send(clear);
    }

    // gets the initial text that requires a message to send ("ghci version...")
    // @param callback  callback function that is passed the initial text
    init(callback){
        // data in waiting to send buffer?
        if(this.responseBuf.length){
            // format buffer to string
            let str = this.responseBuf.join("\n");
            // clear the buffer
            this.responseBuf = [];
            // callback the string 
            callback(str);
        }
        else callback("");
    }

    // loads a file into the ghci process
    load(path){
        this.send(`:load ${path}`);
    }

    // kills the current ghci process
    kill(){
        this.send(":quit");
        this.ghci.unref();
    }

    // getter for if ghci can be used 
    get isAvailable(){
        return this.ghci !== null;
    }
}

// GHCI process (essentially a private static field)
let GHCI_PROCESS = new GhciWrapper();

// handles GHCI operation requests (automatically responds)
class GhciOps{
    // executes haskell code in the REPL
    // @param evt   event object for responding
    // @param str   haskell code to execute
    static executeCode(evt, {str=null}){
        // ghci must be working 
        if(!GHCI_PROCESS.isAvailable){
            IpcResponder.respondNoGhci(evt);
            return;
        }

        // must have haskell code to execute 
        if(!str){
            let err = "No code provided (str is null or empty.)";
            IpcResponder.respond(evt, "ghci", {err: err.message});
            return;
        }

        // execute the code
        // do not respond (using evt) because response is async
        // (handled with the wrapper's auto stdout listeners)
        GHCI_PROCESS.responseEvt = evt;
        GHCI_PROCESS.send(str);
    }

    // restarts the ghci process with a file to load
    // @param evt   event object for responding
    // @param str   haskell file to run 
    // @param save  auto save the file 
    static executeFile(evt, {path=null, str=""}){
        // ghci must be working 
        if(!GHCI_PROCESS.isAvailable){
            IpcResponder.respondNoGhci(evt);
            return;
        }

        // must have haskell file to execute 
        if(!path){
            let err = "No file path provided (path is null or empty.)";
            IpcResponder.respond(evt, "ghci", {err: err.message});
            return;
        }

        // fix problem where path folder had spaces
        path = path.includes(" ") ? `"${path}"` : path;

        // load and run the file 
        // do not respond (using evt) because response is async
        // (handled with the wrapper's auto stdout listeners)
        if(str){
            // file changed
            FileUtils.writeFile(path, str)
                .then(() => {
                    // file updated
                    IpcResponder.respond(evt, "file-write", {path});

                    // now run
                    GHCI_PROCESS.responseEvt = evt;
                    GHCI_PROCESS.load(path);
                })
                .catch(err => {
                    // file write error
                    IpcResponder.respond(evt, "file-write", {err: err.message});
                });
        }
        else{
            // file not changed
            GHCI_PROCESS.responseEvt = evt;
            GHCI_PROCESS.load(path);
        }
    }

    // clears the GHCI REPL 
    // @param evt   event object for responding
    static clear(evt){
        // ghci must be working 
        if(!GHCI_PROCESS.isAvailable){
            IpcResponder.respondNoGhci(evt);
            return;
        }

        GHCI_PROCESS.clear();
        IpcResponder.respond(evt, "ghci-clear");
    }

    // gets the initial buffer data
    // @param evt   event object for responding 
    static init(evt){
        // ghci must be working 
        if(!GHCI_PROCESS.isAvailable){
            IpcResponder.respondNoGhci(evt);
            return;
        }

        // get buffer text
        GHCI_PROCESS.init(str => {
            // send the text ("ghci version...")
            IpcResponder.respond(evt, "ghci", {str});
        });
    }
}

module.exports = { GhciOps };