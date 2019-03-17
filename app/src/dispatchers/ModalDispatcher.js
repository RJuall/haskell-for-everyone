import { EventEmitter } from "events";

// "enumerated" event types 
export const CREATE_FILE_MODAL =    "create-file-modal",
    SAVE_FILE_AS_MODAL =            "save-file-as-modal",
    ALERT_MODAL =                   "alert-modal",
    SELECT_FILE_MODAL =             "select-file-modal",
    SELECT_FOLDER_MODAL =           "select-folder-modal",
    CREATE_ROOM_MODAL =             "create-room-modal",
    JOIN_ROOM_MODAL =               "join-room-modal";

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

    // signals an alert popup modal
    // @param header    modal header
    // @param body      modal body
    // @param footer    modal footer
    alertModal(header=null, body=null, footer=null){
        this.emit(ALERT_MODAL, {header, body, footer});
    }

    // signals the select file modal should be displayed 
    selectFileModal(){
        this.emit(SELECT_FILE_MODAL);
    }

    // signals the select folder modal should be displayed 
    selectFolderModal(){
        this.emit(SELECT_FOLDER_MODAL);
    }

    // signals create room modal should be displayed
    createRoomModal(){
        this.emit(CREATE_ROOM_MODAL);
    }

    // signals join room modal should be displayed
    joinRoomModal(){
        this.emit(JOIN_ROOM_MODAL);
    }
}

// export singleton 
export default new ModalDispatcher();