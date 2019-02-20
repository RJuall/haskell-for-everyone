const { FolderDataUtils } = require("../utils/FolderDataUtils");
const { IpcResponder } = require("../utils/IpcResponder");

// handles folder operation requests (automatically responds)
export class FolderOps{
    // adds a folder from the data file and responds
    // @param evt       event object for responding
    // @param path      folder path to add
    static addFolder(evt, {path=null}){
        // must have folder path
        if(!path){
            let err = "No folder path provided (path is null or empty).";
            IpcResponder.respond(evt, "folder-add", {err});
            return;
        }

        // asynchronously add the folder
        FolderDataUtils.addFolder(path)
            .then(() => {
                // folder added to data file 
                IpcResponder.respond(evt, "folder-add");
            })
            .catch(err => {
                // failed to add folder to data file
                IpcResponder.respond(evt, "folder-add", {err: err.message});
            });
    }

    // removes a folder from the data file and responds
    // @param evt       event object for responding
    // @param path      folder path to remove
    static removeFolder(evt, {path=null}){
        // must have folder path 
        if(!path){
            let err = "No folder path provided (path is null or empty).";
            IpcResponder.respond(evt, "folder-remove", {err});
            return;
        }

        // asychronously remove the folder
        FolderDataUtils.removeFolder(path)
            .then(() => {
                // folder removed from data file 
                IpcResponder.respond(evt, "folder-remove");
            })
            .catch(err => {
                // failed to remove folder from data file 
                IpcResponder.respond(evt, "folder-remove", {err: err.message});
            });
    }

    // resets the folder data file and responds
    // @param evt       event object for responding
    static resetFolders(evt){
        // asychronously reset the folder data file
        FolderDataUtils.resetFolderData()
            .then(() => {
                // successfully reset the folder data file 
                IpcResponder.respond(evt, "folder-reset");
            })
            .catch(err => {
                // failed to reset folder data file
                IpcResponder.respond(evt, "folder-reset", {err: err.message});
            });
    }
}