import { EventEmitter } from "events";
import IpcRequester from "../utils/IpcRequester";

// "enumerated" event types for files 
export const FILE_READ =    "file-read",
            FILE_WRITE =    "file-write",
            FILE_CREATE =   "file-create",
            FILES_GET =     "files-get";

class FileDispatcher extends EventEmitter{
    constructor(){
        super();

        // forward events 
        IpcRequester.on(FILE_READ, evt => this.emit(FILE_READ, evt));
        IpcRequester.on(FILE_WRITE, evt => this.emit(FILE_WRITE, evt));
        IpcRequester.on(FILE_CREATE, evt => this.emit(FILE_CREATE, evt));
        IpcRequester.on(FILES_GET, evt => this.emit(FILES_GET, evt));
    }

    // requests a file to be read (responds by event emitting)
    // @param path          name of the file to read (dir included)
    readFile(path){
        IpcRequester.send(FILE_READ, {path});
    }

    // requests a file to be written (responds by event emitting)
    // @param path          name of the file to write (dir included)
    // @param str           string to write 
    writeFile(path, str=""){
        IpcRequester.send(FILE_WRITE, {path, str});
    }

    // creates a new file in a directory (responds by event emitting)
    // @param path          name of the file to write (dir included)
    // @param str           initial file text 
    createFile(path, str=""){
        IpcRequester.send(FILE_CREATE, {path, str});
    }

    // requests the names of all files in a directory (responds by event emitting)
    // @param dir           directory to search in
    getFileNames(dir){
        IpcRequester.send(FILES_GET, {dir});
    }
}

// export singleton 
export default new FileDispatcher();