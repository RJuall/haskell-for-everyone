const fs = require("fs");

// file system calls (promise wrappers)
class FileUtils{
    // writes a file asychronously
    // @param fname file name to write
    // @param str   string to write to the file 
    static writeFile(fname, str){
        return new Promise((resolve, reject) => {
            fs.writeFile(fname, str, err => {
                err ? reject(err) : resolve("Success.");
            });
        });
    }

    // reads a file asychronously 
    // @param fname     filen name to read
    static readFile(fname){
        return new Promise((resolve, reject) => {
            fs.readFile(fname, (err, buf) => {
                if(!err){
                    resolve(buf.toString());
                }
                else reject(err);
            });
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