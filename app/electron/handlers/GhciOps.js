const { spawn } = require("child_process");
const { IpcResponder } = require("../utils/IpcResponder");

// wrapper class for forked GHCI child process 
class GhciWrapper{
    constructor(){
        // GHCI child process
        this.ghci = spawn("ghci", {
            stdio: [null, null, null, "ipc"]
        });

        // last request event (used to respond)
        this.responseEvt = null;

        // update renderer process on outputs
        this.ghci.on("message", str => {
            if(this.responseEvt){
                IpcResponder.respond(this.responseEvt, "ghci", {str});
                this.responseEvt = null;
            }
        });

        // update renderer process on errors 
        this.ghci.on("error", err => {
            if(this.responseEvt){
                IpcResponder.respond(this.responseEvt, "ghci", {err: err.message});
                this.responseEvt = null;
            }
        });
    }

    // sends code to the GHCI process 
    // @param code      haskell code to execute in REPL
    // @param callback  callback function 
    send(code, callback){
        // (work in progress!)
        this.ghci.send(code, callback);
    }
}

// GHCI process (essentially a private static field)
const GHCI = new GhciWrapper();

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

        // execute the code
        // do not respond (using evt) because response is async
        // (handled with the wrapper's auto stdout listeners)
        GHCI.responseEvt = evt;
        GHCI.send(str, err => console.log(err));
    }

    // clears the GHCI REPL 
    // @param evt   event object for responding
    static clear(evt){
        // different clear messages depending on OS (of course -_-)
        let clear = process.platform === "win32" ? ":! cls" : ": clear";
        GHCI.send(clear);

        IpcResponder.respond(evt, "ghci-clear");
    }
}

module.exports = { GhciOps };