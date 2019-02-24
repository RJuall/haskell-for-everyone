import { EventEmitter } from "events";

class ModalDispatcher extends EventEmitter{
    // signals the create file modal
    // @param dir   forced directory input
    createFileModal(dir=null){
        this.emit("create-file", {dir});
    }
}

// export singleton 
export default new ModalDispatcher();