import { EventEmitter } from "events";
import IpcRequester from "../utils/IpcRequester";

// "enumerated" event types 
export const GHCI = "ghci",
    GHCI_CLEAR =    "ghci-clear",
    GHCI_INIT =     "ghci-init",
    GHCI_ERROR =    "ghci-error",
    GHCI_FILE =     "ghci-file";

class GhciDispatcher extends EventEmitter{
    constructor(){
        super();

        // forward events 
        IpcRequester.on(GHCI, evt => this.emit(GHCI, evt));
        IpcRequester.on(GHCI_CLEAR, evt => this.emit(GHCI_CLEAR, evt));
        IpcRequester.on(GHCI_INIT, evt => this.emit(GHCI_INIT, evt));
        IpcRequester.on(GHCI_ERROR, evt => this.emit(GHCI_ERROR, evt));
    }

    // requests haskell code to be executed
    // @param code      haskell code to execute
    executeCode(code){
        IpcRequester.send(GHCI, {str: code});
    }

    // requests haskell file to be executed in GHCi
    // @param path      haskell file to execute
    executeFile(path){
        IpcRequester.send(GHCI_FILE, {path});
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