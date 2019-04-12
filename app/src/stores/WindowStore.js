import { settingsStore } from './SettingsStore';
import { decorate, autorun, observable, action } from 'mobx';
import { windowDefaults } from './defaults/WindowDefaults';
import IpcRequester from '../utils/IpcRequester';

class WindowStore {

    constructor(props) {
        this.globalWindowSettings = {};
 
        this.windowSettings = {
            theme: "light",
            themeText: "Toggle Light Background"
        };

        this.sessionWindowStore = {
            modalEasterEggOpen: windowDefaults.modalEasterEggOpen,
        };

        IpcRequester.on("settings-get", ({settings}) => {
            this.globalWindowSettings = settings.windowSettings;
            Object.assign(this.windowSettings, this.globalWindowSettings);
        } )
    }

    updateThemeText(){
        let isDark = this.windowSettings.theme === "dark";

        let text = isDark ? "Light" : "Dark";

        this.windowSettings.themeText = `Toggle ${text} Background`;
    }

    windowSettingsDisposer = action( autorun( () => {
        let windowSettings = {
            // all windowSettings fields go here
            theme: this.windowSettings.theme
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