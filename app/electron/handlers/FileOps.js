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

        // must have slash at end
        dir = dir.endsWith("/") ? dir : `${dir}/`;

        // get file names promise 
        FileUtils.getFileNames(dir)
            .then(fileNames => {
                // got file names array 
                IpcResponder.respond(evt, "get-files", {fileNames, dir});
            })
            .catch(err => {
                // error
                IpcResponder.respond(evt, "get-files", {err: err.message});
            });
    }

    // reads the string contents of a file
    // @param evt       event object for response
    // @param fileName  name of file to read 
    static readFile(evt, {fileName=null}){
        // must have file name
        if(!fileName){
            let err = "No file name provided (fileName is null).";
            IpcResponder.respond(evt, "read-file", {err});
            return;
        }

        // read file promise 
        FileUtils.readFile(fileName)
            .then(str => {
                // got file contents 
                IpcResponder.respond(evt, "read-file", {fileName, str});
            })
            .catch(err => {
                // error
                IpcResponder.respond(evt, "read-file", {err: err.message});
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
            IpcResponder.respond(evt, "write-file", {err});
            return;
        }
        // must have string to write 
        if(str === null){
            let err = "No text provided (str is null).";
            IpcResponder.respond(evt, "write-file", {err});
            return;
        }

        // save file promise
        FileUtils.writeFile(fileName, str)
            .then(() => {
                // saved file 
                IpcResponder.respond(evt, "write-file");
            })
            .catch(err => {
                // error
                IpcResponder.respond(evt, "write-file", {err: err.message});
            });
    }
}

module.exports = { FileOps };