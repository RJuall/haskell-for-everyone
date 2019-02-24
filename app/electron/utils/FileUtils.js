const fs = require("fs");

// file system calls (promise wrappers)
class FileUtils{
    // writes a file asychronously
    // @param path  file path to write
    // @param str   string to write to the file 
    static writeFile(path, str){
        console.log('fu write', str);
        return new Promise((resolve, reject) => {
            fs.writeFile(path, str, err => {
                err ? reject(err) : resolve("Success.");
            });
        });
    }

    // reads a file asychronously 
    // @param path      filen path to read
    static readFile(path){
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, buf) => {
                if(!err){
                    resolve(buf.toString());
                }
                else reject(err);
            });
        });
    }

    // writes a file if it does not exist 
    // @param path  file to write
    // @param str   initial file contents (optional)
    static createFile(path, str=""){
        return new Promise((resolve, reject) => {
            // check if file exists
            this.fileExists(path).then(exists => {
                if(!exists){
                    // does not exist - write the file 
                    console.log('cf', `--${str}--`)
                    this.writeFile(path, str)
                        .then(() => resolve("File created."))
                        .catch(err => reject(err));
                }
                else reject(new Error("File already exists."));
            });
        });
    }

    // checks if a file exists
    // @param path      file path to check 
    static fileExists(path){
        return new Promise(resolve => {
            fs.exists(path, exists => resolve(exists));
        });
    }

    // gets the names of all files in a directory asychronously
    // @param dir   directory to read file names of 
    static getFileNames(dir){
        return new Promise((resolve, reject) => {
            fs.readdir(dir, (err, fnames) => {
                err ? reject(err) : resolve(fnames);
            });
        });
    }
}

module.exports = { FileUtils };