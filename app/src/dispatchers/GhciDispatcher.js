import { EventEmitter } from "events";
import IpcRequester from "../utils/IpcRequester";

class GhciDispatcher extends EventEmitter{
    constructor(){
        super();

        // forward events 
        IpcRequester.on("ghci", evt => this.emit("ghci", evt));
        IpcRequester.on("ghci-clear", evt => this.emit("ghci-clear", evt));
    }

    // requests haskell code to be executed
    // @param code      hgaskell code to execute
    executeCode(code){
        IpcRequester.send("ghci", {str: code});
    }

    // requests haskell interactive REPL to clear
    clear(){
        IpcRequester.send("ghci-clear");
    }

    // informs of initialization, reads initial buffer 
    init(){
        IpcRequester.send("ghci-init");
    }
}

// export singleton 
export default new GhciDispatcher();