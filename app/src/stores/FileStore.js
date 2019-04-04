import { decorate, autorun, observable, action } from 'mobx';
import { fileDefaults } from './defaults/FileDefaults';
import IpcRequester from '../utils/IpcRequester';

class FileStore {
    constructor(props) {
        this.globalFileSettings = {};
 
        this.fileSettings = {
            //default settings go here
            recentFilePaths:    [],
            lastFilePath:       null
        };

        IpcRequester.on("folder-data-get", this.handleInitialFolderData);
        IpcRequester.getFolderData();
    }

    handleInitialFolderData = ({lastFilePath, recentFilePaths}) => {
        this.globalFileSettings = {lastFilePath, recentFilePaths};
        Object.assign(this.fileSettings, this.globalFileSettings);
    }

    recentPathUpdate(path){
        // concat paths with new path
        let paths = [...this.fileSettings.recentFilePaths, path];

        // unique paths
        paths = paths.filter((currPath, idx) => paths.indexOf(currPath) === idx);

        // top 10 most recent
        paths = paths.slice(0, 10);

        // apply update
        this.fileSettings.recentFilePaths = paths;
    }

    fileSettingsDisposer = action( autorun( () => {
        IpcRequester.updateFolderData(this.fileSettings);
    }))

    cleanUp() {
        this.fileSettingsDisposer();
        IpcRequester.removeListener("folder-data-get", this.handleInitialFolderData);
    }
  
}

decorate(FileStore, {
    fileSettings: observable,
});

export const fileStore = new FileStore();