const { app } = require("electron");
const { FileUtils } = require("../utils/FileUtils");
const { JsonParser } = require("../utils/JsonParser");

// folder data file relative path 
const FOLDER_DATA_FILE = `${app.getPath("userData")}/folder_data.json`;

class FolderData{
    constructor(){
        // all folders
        this._folderPaths = [];
        this._lastFile = null;
    }

    // loads folder data from file 
    init(){
        return new Promise((resolve, reject) => {
            this.loadFile()
                .then(json => {
                    // file loaded - set fields base on file 
                    this._folderPaths = json.folderPaths || [];
                    this._lastFile = json.lastFile || null;

                    resolve(this);
                })
                .catch(err => {
                    // failed to load 
                    if(err.errno === -4058){
                        // missing file - use defaults (empty)
                        this.update()
                            .then(() => resolve(this))
                            .catch(err => reject(err));
                    }
                    else reject(err);
                });
        });
    }

    // adds a folder from the field immediately and asychronously updates the file 
    // @param path      folder path to add
    addFolder(path){
        // append new path (if its unique)
        let paths = this.folderPaths.includes(path) ? this.folderPaths : [...this.folderPaths, path];

        // update object
        this._folderPaths = paths;

        // update the file
        return this.update();
    }

    // removes a folder from the field immediately and asychronously updates the file 
    // @param path      folder path to remove
    removeFolder(path){
        // remove the path from the array
        let updatedPaths = this._folderPaths.filter(currPath => currPath !== path);

        // update object
        this._folderPaths = updatedPaths;

        // update file 
        return this.update();
    }

    // resets the folder field and file 
    resetFolders(){
        // clear folder paths 
        this._folderPaths = [];

        // update file
        return this.update();
    }

    // loads the underyling json file (does not set fields!)
    loadFile(){
        return new Promise((resolve, reject) => {
            // read the settings file and parse 
            FileUtils.readFile(FOLDER_DATA_FILE)
                .then(str => {
                    // parse json
                    JsonParser.parse(str, (err, json) => {
                        err ? reject(err) : resolve(json);
                    }); 
                })
                .catch(err => reject(err));
        });
    }

    // updates the underlying json file and field respresentation
    update(){
        return new Promise((resolve, reject) => {
            // json to stringify
            let json = {folderPaths: this.folderPaths};
            
            // pretty json stringify
            JsonParser.stringifyPretty(json, (err, str) => {
                if(!err){
                    // update the file
                    FileUtils.writeFile(FOLDER_DATA_FILE, str)
                        .then(() => resolve("Updated."))
                        .catch(err => reject(err));
                }
                else reject(err);
            });
        });
    }

    // setter for last file
    // @param fname     last file used name 
    set lastFile(fname){
        // set the name
        this._lastFile = fname;
        // update file 
        this.update();
    }

    // getter for folder pathsf
    get folderPaths(){
        return this._folderPaths;
    }

    // getter for last file 
    get lastFile(){
        return this._lastFile;
    }
}

// export singleton
module.exports = { FolderData: new FolderData() };