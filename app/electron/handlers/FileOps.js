const { FileUtils } = require("../utils/FileUtils");
const { IpcResponder } = require("../utils/IpcResponder");

// handles file operation requests (file utils + automatic responses)
class FileOps{
    // gets the file names in a directory
    // @param evt       event object for response  
    // @param dir       the directory to look in
    static getFileNames(evt, {dir=null}){
        // must have directory
        if(!dir){
            let err = "No directory provided (dir is null or empty).";
            IpcResponder.respond(evt, "get-files", {err});
            return;
        }

        // must NOT have slash at end
        dir = dir.endsWith("/") ? dir.substring(0, dir.length - 1) : dir;

        // get file names promise 
        FileUtils.getFileNames(dir)
            .then(fileNames => {
                // got file names array 
                IpcResponder.respond(evt, "files-get", {fileNames, dir});
            })
            .catch(err => {
                // error
                IpcResponder.respond(evt, "files-get", {err: err.message});
            });
    }

    // reads the string contents of a file
    // @param evt       event object for response
    // @param fileName  name of file to read 
    static readFile(evt, {fileName=null}){
        // must have file name
        if(!fileName){
            let err = "No file name provided (fileName is null).";
            IpcResponder.respond(evt, "file-read", {err});
            return;
        }

        // read file promise 
        FileUtils.readFile(fileName)
            .then(str => {
                // got file contents 
                IpcResponder.respond(evt, "file-read", {fileName, str});
            })
            .catch(err => {
                // error
                IpcResponder.respond(evt, "file-read", {err: err.message});
            });
    }

    // writes the string to a file
    // @param evt       event object for response
    // @param fileName  file name to write
    // @param str       string to write to file 
    static writeFile(evt, {fileName=null, str=null}){
        // must have file name
        if(!fileName){
            let err = "No file name provided (fileName is null).";
            IpcResponder.respond(evt, "file-write", {err});
            return;
        }
        // must have string to write 
        if(str === null){
            let err = "No text provided (str is null).";
            IpcResponder.respond(evt, "file-write", {err});
            return;
        }

        // save file promise
        FileUtils.writeFile(fileName, str)
            .then(() => {
                // saved file 
                IpcResponder.respond(evt, "file-write");
            })
            .catch(err => {
                // error
                IpcResponder.respond(evt, "file-write", {err: err.message});
            });
    }
}

module.exports = { FileOps };