import { EventEmitter } from "events";

// "enumerated" event types 
export const CREATE_FILE_MODAL =    "create-file-modal",
    SAVE_FILE_AS_MODAL =            "save-file-as-modal";

class ModalDispatcher extends EventEmitter{
    // signals the create file modal
    // @param dir   forced directory input
    createFileModal(dir=null){
        this.emit(CREATE_FILE_MODAL, {dir});
    }

    // signals the save file modal
    saveFileAsModal(){
        this.emit(SAVE_FILE_AS_MODAL);
    }
}

// export singleton 
export default new ModalDispatcher();