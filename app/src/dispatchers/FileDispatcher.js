import { EventEmitter } from "events";
import IpcRequester from "../utils/IpcRequester";

// "enumerated" event types for files 
export const FILE_READ =    "file-read",
            FILE_WRITE =    "file-write",
            FILES_GET =     "files-get";

class FileDispatcher extends EventEmitter{
    constructor(){
        super();

        // forward events 
        IpcRequester.on(FILE_READ, evt => this.emit(FILE_READ, evt));
        IpcRequester.on(FILE_WRITE, evt => this.emit(FILE_WRITE, evt));
        IpcRequester.on(FILES_GET, evt => this.emit(FILES_GET, evt));
    }

    // requests a file to be read (responds by event emitting)
    // @param fileName      name of the file to read
    readFile(fileName){
        IpcRequester.send(FILE_READ, {fileName});
    }

    // requests a file to be written (responds by event emitting)
    // @param fileName      name of the file to write
    // @param str           string to write 
    writeFile(fileName, str){
        IpcRequester.send(FILE_WRITE, {fileName, str});
    }

    // requests the names of all files in a directory (responds by event emitting)
    // @param dir           directory to search in
    getFileNames(dir){
        IpcRequester.send(FILES_GET, {dir});
    }
}

// export singleton 
export default new FileDispatcher();