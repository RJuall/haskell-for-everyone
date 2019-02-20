import { EventEmitter } from "events";
import IpcRequester from "../utils/IpcRequester";

class FolderDispatcher extends EventEmitter{
    constructor(){
        super();

        // forward events
        IpcRequester.on("folder-add", evt => this.emit("folder-add", evt));
        IpcRequester.on("folder-remove", evt => this.emit("folder-remove", evt));
        IpcRequester.on("folder-reset", evt => this.emit("folder-reset", evt));
        IpcRequester.on("folder-list", evt => this.emit("folder-list", evt));
    }

    // request a folder to be added to the data file
    // @param path      folder path to add 
    addFolder(path){
        IpcRequester.send("folder-add", {path});
    }

    // requests a folder to removed from the data file
    // @param path      folder path to remove
    removeFolder(path){
        IpcRequester.send("folder-remove", {path});
    }

    // requests the folder data file to be cleared
    resetFolders(){
        IpcRequester.send("folder-reset");
    }

    // requests all the stored folder paths
    getFolderPaths(){
        IpcRequester.send("folder-list");
    }
}

// export singleton 
export default new FolderDispatcher();