import { observable, decorate, autorun, computed, action } from 'mobx';
import IpcRequester from './IpcRequester';

class SettingsStore {
    
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

    get getEditorSettings() {
        return this.settings.editorSettings;
    }

    get getTerminalSettings() {
        return this.settings.terminalSettings;
    }

    get getFileSettings() {
        return this.settings.fileSettings;
    }

    get getWindowSettings() {
        return this.settings.windowSettings;
    }

    updateSettings = action ((editorSettings = {}, terminalSettings = {}, fileSettings = {}, windowSettings = {}) => {
        console.log({editorSettings, terminalSettings, fileSettings, windowSettings})
        //Object.assign(this.settings, {editorSettings: editorSettings, terminalSettings: terminalSettings, fileSettings: fileSettings, windowSettings: windowSettings});
        console.log("SUCCESS");
        console.log(this.settings);
    })

    settingsUpdateDisposer = action( autorun( () => {
        this.saveSettings(this.settings);
    }, { delay: 60000, onError: () => { console.log("Settings file update error.") } }));

    cleanUp() {
        this.settingsUpdateDisposer();
    }
}

decorate(SettingsStore, {
    settings: observable,
    getEditorSettings: computed,
    getTerminalSettings: computed,
    getFileSettings: computed,
    getWindowSettings: computed
})

export const settingsStore = new SettingsStore();