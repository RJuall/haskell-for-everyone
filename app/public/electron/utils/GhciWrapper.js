const { spawn } = require("child_process");
const { EventEmitter } = require("events");

// wrapper class for child GHCI child process 
class GhciWrapper extends EventEmitter{
    constructor(path=null){
        super();

        // ghci child process (setup later)
        this.ghci = null;

        // buffer to hold ghci data that arrives before first request
        // (need request object to respond)
        this.responseBuf = [];

        // last request event (used to respond)
        this.responseEvt = null;

        // GHCI child process
        // possibly emits error 
        this.setupGhciChildProcess(path);
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
            callback ? callback(err) : this.emit("setup-error");
            return;
        }

        // link process 
        this.ghci = ghciProcess;

        // handle ghci output 
        this.ghci.stdout.on("data", buf => this.handleGhciOutput(buf));

        // handle ghci errors 
        this.ghci.stdout.on("error", err => this.handleGhciError(err));
        this.ghci.stderr.on("data", buf => this.handleGhciOutput(buf));
        this.ghci.stderr.on("error", err => this.handleGhciError(err));
    }

    // handles output from ghci process sockets 
    // emits output occurred for listener to handle 
    // @param param     utf8 buffer or just a string 
    handleGhciOutput(buf){
        // get the output as a string
        let str = buf.toString();

        if(this.responseEvt){
            // any response data in buffer that needs to be sent?
            if(this.responseBuf.length){
                // yes, place buffered data in output 
                str = this.responseBuf.join("\n") + "\n" + str;
                this.responseBuf = [];
            }

            // response object - send response
            this.emit("output", {str});
        }
        else{
            // no response object yet - store in buffer 
            this.responseBuf.push(str);
        }
    }

    // handler for when ghci process has an error
    // @param err   event error or err message string 
    handleGhciError(err){
        if(!this.ghci.stdin.writable){
            this.restart();
        }
        // this.handleGhciOutput(err.message || err);
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

    // restarts the ghci process (should be used if the proc is dead from error)
    // @param path  haskell file to initialize with (optional)
    restart(path=null){
        // remove current proc listener
        this.ghci.stderr.removeAllListeners();
        this.ghci.stdout.removeAllListeners();

        // stop current proc 
        this.ghci.unref();
        this.ghci = null;

        // start a new one 
        this.setupGhciChildProcess(path);
    }

    // getter for if ghci can be used 
    get isAvailable(){
        return this.ghci !== null;
    }
}

module.exports = { GhciWrapper };