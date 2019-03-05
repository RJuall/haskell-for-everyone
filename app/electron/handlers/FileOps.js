const { FileUtils } = require("../utils/FileUtils");
const { IpcResponder } = require("../utils/IpcResponder");
const { FolderData } = require("../utils/FolderData");

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
    // @param path      name of file to read 
    static readFile(evt, {path=null}){
        // must have file name
        if(!path){
            let err = "No file name provided (path is null).";
            IpcResponder.respond(evt, "file-read", {err});
            return;
        }

        // read file promise 
        FileUtils.readFile(path)
            .then(str => {
                // got file contents 
                IpcResponder.respond(evt, "file-read", {path, str});
            })
            .catch(err => {
                // error
                IpcResponder.respond(evt, "file-read", {err: err.message});
            });
    }

    // writes the string to a file
    // @param evt       event object for response
    // @param path      file path to write
    // @param str       string to write to file 
    static writeFile(evt, {path=null, str=null}){
        // must have file name
        if(!path){
            let err = "No file name provided (path is null).";
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
        FileUtils.writeFile(path, str)
            .then(() => {
                // saved file 
                IpcResponder.respond(evt, "file-write", {path});
            })
            .catch(err => {
                // error
                IpcResponder.respond(evt, "file-write", {err: err.message});
            });
    }

    // creates a new file empty file
    // @param evt       event object for response
    // @param path      file path to create
    // @param str       initial file contents (optional)
    static createFile(evt, {path=null, str=""}){
        // must have file path
        if(!path){
            let err = "No file name provided (path is null).";
            IpcResponder.respond(evt, "file-create", {err});
            return;
        }

        // figure file path data from file string 
        let fileName = path.split("/").pop();
        let dir = path.split(`/${fileName}`)[0];
        let knownFolder = FolderData.folderPaths.includes(path);

        // create the file 
        FileUtils.createFile(path, str)
            .then(() => {
                // file created
                IpcResponder.respond(evt, "file-create", {dir, fileName, knownFolder});
            })
            .catch(err => {
                // error
                IpcResponder.respond(evt, "file-create", {err: err.message});
            });
    }
}

module.exports = { FileOps };