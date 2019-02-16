const { FileUtils } = require("../utils/FileUtils");
const { IpcResponder } = require("../utils/IpcResponder");

// handles file operations (file utils + automatic responses)
class FileOps{
    // gets the file names in a directory
    // @param event     event object for response  
    // @param dir       the directory to look in
    static getFileNames(event, dir){
        // must have slash at end
        dir = dir.endsWith("/") ? dir : `${dir}/`;

        // get file names promise 
        FileUtils.getFileNames(dir)
            .then(fileNames => {
                // add path 
                fileNames = fileNames.map(fname => `${dir}${fname}`);

                // got file names array 
                IpcResponder.respond(event, "get-files", {fileNames});
            })
            .catch(err => {
                // error
                IpcResponder.respond(event, "get-files", {err: err.message});
            });
    }

    // reads the string contents of a file
    // @param event     event object for response
    // @param fileName  name of file to read 
    static readFile(event, fileName){
        // read file promise 
        FileUtils.readFile(fileName)
            .then(str => {
                // got file contents 
                IpcResponder.respond(event, "read-file", {fileName, str});
            })
            .catch(err => {
                // error
                IpcResponder.respond(event, "read-file", {err: err.message});
            });
    }

    // writes the string to a file
    // @param event     event object for response
    // @param fileName  file name to write
    // @param str       string to write to file 
    static writeFile(event, fileName, str){
        // save file promise
        FileUtils.writeFile(fileName, str)
            .then(() => {
                // saved file 
                IpcResponder.respond(event, "write-file");
            })
            .catch(err => {
                // error
                IpcResponder.respond(event, "write-file", {err: err.message});
            });
    }
}

module.exports = { FileOps };