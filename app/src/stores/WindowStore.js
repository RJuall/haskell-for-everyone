import { settingsStore } from './SettingsStore';
import { decorate, autorun, observable, action } from 'mobx';
import { windowDefaults } from './defaults/WindowDefaults';
import IpcRequester from '../utils/IpcRequester';

class WindowStore {

    constructor(props) {
        this.globalWindowSettings = {};
 
        this.windowSettings = {
            //default settings go here
        };

        IpcRequester.on("settings-get", ({settings}) => {
            this.globalWindowSettings = settings.windowSettings;
            Object.assign(this.windowSettings, this.globalWindowSettings);
        } )
    }

    windowSettingsDisposer = action( autorun( () => {
        let windowSettings = {
            // all windowSettings fields go here
        };
        settingsStore.updateSettings(windowSettings);
    }))

    cleanUp() {
        this.windowSettingsDisposer();
        IpcRequester.removeListener("settings-get", evt => {});
    }
  
}

decorate(WindowStore, {
    windowSettings: observable,
});

export const windowStore = new WindowStore();