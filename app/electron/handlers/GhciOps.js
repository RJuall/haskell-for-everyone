const { spawn } = require("child_process");
const { IpcResponder } = require("../utils/IpcResponder");

// wrapper class for forked GHCI child process 
class GhciWrapper{
    constructor(){
        // GHCI child process
        this.ghci = spawn("ghci");

        // buffer to hold ghci data that arrives before first request
        // (need request object to respond)
        this.responseBuf = [];

        // last request event (used to respond)
        this.responseEvt = null;

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

        // handle ghci error 
        this.ghci.stderr.on("data", buf => {
            // send error message if one exists 
            if(this.responseEvt){
                IpcResponder.respond(this.responseEvt, "ghci", {err: buf.toString()});
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
        GHCI.send(str);
    }

    // clears the GHCI REPL 
    // @param evt   event object for responding
    static clear(evt){
        GHCI.clear();

        IpcResponder.respond(evt, "ghci-clear");
    }

    // gets the initial buffer data
    // @param evt   event object for responding 
    static init(evt){
        // get buffer text
        GHCI.init(str => {
            // send the text ("ghci version...")
            IpcResponder.respond(evt, "ghci", {str});
        });
    }
}

module.exports = { GhciOps };