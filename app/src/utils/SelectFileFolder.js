import FolderDispatcher from "../dispatchers/FolderDispatcher";
import FileDispatcher from "../dispatchers/FileDispatcher";
import { FileExtension } from "./FileExtension";

const { dialog } = window.require("electron").remote;

export class SelectFileFolder{

    // forces the folder select dialog
    // @param callback      selection callback (array or undefined)
    static selectFolderDialog(callback){
        let options = {
            properties: ["openFile", "openDirectory"]
        };

        dialog.showOpenDialog(options, callback);
    }

    // forces the file select dialog
    // @param callback      selection callback (array or undefined)
    static selectFileDialog(callback){
        // only allow valid extensions
        let extensions = FileExtension.list().map(a => a.replace(/\./g, ""));

        let options = {
            properties: ["openFile"],
            filters: [{name: "All Files", extensions}]
        };

        dialog.showOpenDialog(options, callback);
    }

    // forces the select folder dialog THEN adds the folder to the system
    static selectFolder(){
        SelectFileFolder.selectFolderDialog(folderPaths => {
            if(folderPaths && folderPaths.length){
                // get the input path 
                let path = SelectFileFolder.cleanPath(folderPaths[0]);

                // add the folder 
                FolderDispatcher.addFolder(path);
            }
        });
    }

    // forces the select folder dialog THEN adds the file to the system
    static selectFile(){
        SelectFileFolder.selectFileDialog(filePaths => {
            if(filePaths && filePaths.length){
                // get input path
                let path = SelectFileFolder.cleanPath(filePaths[0]);

                // split.pop will make split the directory 
                let split = path.split("/");
                split.pop();

                // add the directory and open the file 
                FolderDispatcher.addFolder(split.join("/"));
                FileDispatcher.readFile(path);
            }
        });
    }

    // cleans the file path
    // @param path      raw file path from user input 
    static cleanPath(path){
        let p = path.replace(/(\\)/g, "/");
        return p.endsWith("/") ? p.substring(0, p.length-1) : p;
    }
}