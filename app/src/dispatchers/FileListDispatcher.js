import { EventEmitter } from "events";

// 'enumerated' event types
export const FILES_DEACTIVATE = "file-list-deactivate",
    SET_PATH = "file-list-set-path";

class FileListDispatcher extends EventEmitter{
    constructor(props){
        super();
        this._currentFolderPath = null;
    }

    // triggers each file to deactivate
    decativeAllFiles(){
        this.emit(FILES_DEACTIVATE);
    }

    // setter for new folder path 
    set currentFolderPath(path){
        this._currentFolderPath = path;
        this.emit(SET_PATH, {path});
    }

    // getter for current folder path
    get currentFolderPath(){
        return this._currentFolderPath;
    }
}

// export singleton
export default new FileListDispatcher();