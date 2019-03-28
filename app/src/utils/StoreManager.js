import { observable, decorate, autorun, computed } from 'mobx';
import IpcRequester from './IpcRequester';

class StoreManager {
    
    settings = {
        editorSettings: {},
        terminalSettings: {},
        fileSettings: {},
        windowSettings: {}
    };

    constructor(props) {
        IpcRequester.on("settings-get", evt => Object.assign(this.settings, evt.settings));
        IpcRequester.getSettings();
    }

    saveSettings(settings) {
        IpcRequester.updateSettings(settings);
    }

    settingsUpdater = autorun( () => {
         this.saveSettings(this.settings);
    }, { delay: 60000, onError: () => { console.log("Settings file update error.") } });
}

decorate(StoreManager, {
    settings: observable,
})

export default new StoreManager()