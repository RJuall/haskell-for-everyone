import { EventEmitter } from "events";
import IpcRequester from "../utils/IpcRequester";

// "enumerated" event types 
const FOLDER_ADD =  "folder-add",
    FOLDER_REMOVE = "folder-remove",
    FOLDER_RESET =  "folder-reset",
    FOLDER_LIST =   "folder-list";

class FolderDispatcher extends EventEmitter{
    constructor(){
        super();

        // forward events
        IpcRequester.on(FOLDER_ADD, evt => this.emit("folder-add", evt));
        IpcRequester.on(FOLDER_REMOVE, evt => this.emit("folder-remove", evt));
        IpcRequester.on(FOLDER_RESET, evt => this.emit("folder-reset", evt));
        IpcRequester.on(FOLDER_LIST, evt => this.emit("folder-list", evt));
    }

    // request a folder to be added to the data file
    // @param path      folder path to add 
    addFolder(path){
        IpcRequester.send(FOLDER_ADD, {path});
    }

    // requests a folder to removed from the data file
    // @param path      folder path to remove
    removeFolder(path){
        IpcRequester.send(FOLDER_REMOVE, {path});
    }

    // requests the folder data file to be cleared
    resetFolders(){
        IpcRequester.send(FOLDER_RESET);
    }

    // requests all the stored folder paths
    getFolderPaths(){
        IpcRequester.send(FOLDER_LIST);
    }
}

// export singleton 
export default new FolderDispatcher();