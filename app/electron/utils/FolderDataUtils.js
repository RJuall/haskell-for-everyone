const { FileUtils } = require("../utils/FileUtils");

// folder data file relative path 
const FOLDER_DATA_FILE = "folder_data.txt";

// manages the folder data file 
class FolderDataUtils{
    // loads the contents of the folder data file (array of paths)
    static loadFolderData(){
        return new Promise((resolve, reject) => {
            // read the file string 
            FileUtils.readFile(FOLDER_DATA_FILE)
                .then(str => {
                    // paths are comma delimited 
                    // create array from string 
                    let folderPaths = str.split(",");
                    resolve(folderPaths);
                })
                .catch(err => reject(err));
        });
    }

    // adds a folder path to the data file (must be a unique path)
    // @param path      the path of the new folder to remember
    static addFolder(path){
        return new Promise((resolve, reject) => {
            // load the folder paths array
            this.loadFolderData()
                .then(folderPaths => {
                    // append new path (if its unique)
                    let paths = folderPaths.includes(path) ? folderPaths : [...folderPaths, path];

                    // save the updated paths to data the file 
                    this.updateFolderData(paths)
                        .then(() => resolve(paths))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        });
    }

    // removes a folder from the data file 
    // @param path      the path of the folder to forget
    static removeFolder(path){
        return new Promise((resolve, reject) => {
            // load the folder paths array
            this.loadFolderData()
                .then(folderPaths => {
                    // remove the path from the array
                    let updatedPaths = folderPaths.filter(currPath => currPath !== path);

                    // update the data file
                    this.updateFolderData(updatedPaths)
                        .then(() => resolve(updatedPaths))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        });
    }

    // updates the folder data file with an array of paths
    // @param folderPaths   an array of path strings 
    static updateFolderData(folderPaths){
        return FileUtils.writeFile(FOLDER_DATA_FILE, folderPaths.join(","));
    }

    // resets the folder data file by removing all paths stored
    static resetFolderData(){
        return FileUtils.writeFile(FOLDER_DATA_FILE, "");
    }
}

module.exports = { FolderDataUtils };