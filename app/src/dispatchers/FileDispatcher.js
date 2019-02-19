import { EventEmitter } from "events";
import IpcRequester from "../utils/IpcRequester";

class FileDispatcher extends EventEmitter{
    constructor(){
        super();

        // forward events 
        IpcRequester.on("read-file", evt => this.emit("read-file", evt));
        IpcRequester.on("write-file", evt => this.emit("write-file", evt));
        IpcRequester.on("get-files", evt => this.emit("get-files", evt));
    }

    // requests a file to be read (responds by event emitting)
    // @param fileName      name of the file to read
    readFile(fileName){
        IpcRequester.send("read-file", {fileName});
    }

    // requests a file to be written (responds by event emitting)
    // @param fileName      name of the file to write
    // @param str           string to write 
    writeFile(fileName, str){
        IpcRequester.send("write-file", {fileName, str});
    }

    // requests the names of all files in a directory (responds by event emitting)
    // @param dir           directory to search in
    getFileNames(dir){
        IpcRequester.send("get-files", {dir});
    }
}

// export singleton 
export default new FileDispatcher();