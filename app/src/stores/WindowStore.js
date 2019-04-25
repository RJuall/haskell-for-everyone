import { settingsStore } from './SettingsStore';
import { decorate, autorun, observable, action } from 'mobx';
import { windowDefaults } from './defaults/WindowDefaults';
import IpcRequester from '../utils/IpcRequester';

class WindowStore {

    constructor(props) {
        this.globalWindowSettings = {};
 
        this.windowSettings = {
            theme: "dark",
            hideFile: false,
            hideGHCI: false,
            showSearch: false
        };

        this.sessionWindowStore = {
            modalEasterEggOpen: windowDefaults.modalEasterEggOpen,
        };

        IpcRequester.on("settings-get", ({settings}) => {
            this.globalWindowSettings = settings.windowSettings;
            Object.assign(this.windowSettings, this.globalWindowSettings);
        } )
    }

    windowSettingsDisposer = action( autorun( () => {
        let windowSettings = {
            // all windowSettings fields go here
            theme: this.windowSettings.theme,
            showFile: this.windowSettings.hideFile,
            showGHCI: this.windowSettings.hideGHCI,
            showSearch: this.windowSettings.showSearch
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
    sessionWindowStore: observable,
});

export const windowStore = new WindowStore();