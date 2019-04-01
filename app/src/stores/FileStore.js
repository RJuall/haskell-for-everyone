import { settingsStore } from './SettingsStore';
import { decorate, autorun, observable, action } from 'mobx';
import { fileDefaults } from './defaults/FileDefaults';
import IpcRequester from '../utils/IpcRequester';

class FileStore {

    constructor(props) {
        this.globalFileSettings = {};
 
        this.fileSettings = {
            //default settings go here
        };

        IpcRequester.on("settings-get", ({settings}) => {
            this.globalFileSettings = settings.fileSettings;
            Object.assign(this.fileSettings, this.globalFileSettings);
        } )
    }

    fileSettingsDisposer = action( autorun( () => {
        let fileSettings = {
            // all fileSettings fields go here
        };
        settingsStore.updateSettings(fileSettings);
    }))

    cleanUp() {
        this.fileSettingsDisposer();
        IpcRequester.removeListener("settings-get", evt => {});
    }
  
}

decorate(FileStore, {
    fileSettings: observable,
});

export const fileStore = new FileStore();