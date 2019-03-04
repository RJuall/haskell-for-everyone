import { EventEmitter } from "events";

// "enumerated" event types 
const CREATE_FILE_MODAL =   "create-file-modal",
    SAVE_FILE_MODAL =       "save-file-modal";

class ModalDispatcher extends EventEmitter{
    // signals the create file modal
    // @param dir   forced directory input
    createFileModal(dir=null){
        this.emit(CREATE_FILE_MODAL, {dir});
    }

    // signals the save file modal
    // @param dir   forced directory input
    saveFileModal(dir=null){
        this.emit(SAVE_FILE_MODAL, {dir});
    }
}

// export singleton 
export default new ModalDispatcher();