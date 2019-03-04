import { EventEmitter } from "events";
import IpcRequester from "../utils/IpcRequester";

// "enumerated" event types 
const GHCI = "ghci",
    GHCI_CLEAR = "ghci-clear",
    GHCI_INIT = "ghci-init";

class GhciDispatcher extends EventEmitter{
    constructor(){
        super();

        // forward events 
        IpcRequester.on(GHCI, evt => this.emit("ghci", evt));
        IpcRequester.on(GHCI_CLEAR, evt => this.emit("ghci-clear", evt));
    }

    // requests haskell code to be executed
    // @param code      hgaskell code to execute
    executeCode(code){
        IpcRequester.send(GHCI, {str: code});
    }

    // requests haskell interactive REPL to clear
    clear(){
        IpcRequester.send(GHCI_CLEAR);
    }

    // informs of initialization, reads initial buffer 
    init(){
        IpcRequester.send(GHCI_INIT);
    }
}

// export singleton 
export default new GhciDispatcher();