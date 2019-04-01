import { observable, decorate, autorun, computed, action } from 'mobx';
import IpcRequester from '../utils/IpcRequester';

class SettingsStore {
    
    settings = {
        editorSettings: {},
        terminalSettings: {},
        fileSettings: {},
        windowSettings: {}
    };

    constructor(props) {
        IpcRequester.on("settings-get", evt => { Object.assign(this.settings, evt.settings) });
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
        Object.assign(this.settings, {editorSettings, terminalSettings, fileSettings, windowSettings});
    })

    settingsUpdateDisposer = action( autorun( () => {
        this.saveSettings(this.settings);
    }, { delay: 30000, onError: () => { console.log("Settings file update error.") } }));

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