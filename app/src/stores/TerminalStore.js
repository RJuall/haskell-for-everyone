import { settingsStore } from './SettingsStore';
import { decorate, autorun, observable, action } from 'mobx';
import { terminalDefaults } from './defaults/TerminalDefaults';
import IpcRequester from '../utils/IpcRequester';

class TerminalStore {

    constructor(props) {
        this.globalTerminalSettings = {};
 
        this.terminalSettings = {
            // default settings go here
        };

        IpcRequester.on("settings-get", ({settings}) => {
            this.globalTerminalSettings = settings.terminalSettings;
            Object.assign(this.terminalSettings, this.globalTerminalSettings);
        } )
    }

    terminalSettingsDisposer = action( autorun( () => {
        let terminalSettings = {
            // all terminalSettings fields go here
        };
        settingsStore.updateSettings(terminalSettings);
    }))

    cleanUp() {
        this.terminalSettingsDisposer();
        IpcRequester.removeListener("settings-get", evt => {});
    }
  
}

decorate(TerminalStore, {
    terminalSettings: observable,
});

export const terminalStore = new TerminalStore();