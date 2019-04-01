import { settingsStore } from './SettingsStore';
import { decorate, autorun, observable, action } from 'mobx';
import { editorDefaults } from './defaults/EditorDefaults';
import IpcRequester from '../utils/IpcRequester';

class EditorStore {

    constructor(props) {
        this.globalEditorSettings = {};
 
        this.editorSettings = {
            fontSize: editorDefaults.fontSize,
            fontFamily: editorDefaults.fontFamily,
            theme: editorDefaults.theme,
            name: editorDefaults.name,
            height: editorDefaults.height,
            width: editorDefaults.width,
            mode: editorDefaults.mode,
            enableBasicAutocompletion: editorDefaults.enableBasicAutocompletion,
            enableLiveAutocompletion: editorDefaults.enableLiveAutocompletion,
            enableSnippets: editorDefaults.enableSnippets,
            blockScrolling: editorDefaults.blockScrolling,
            wrapEnabled: editorDefaults.wrapEnabled,
        }

        IpcRequester.on("settings-get", ({settings}) => {
            this.globalEditorSettings = settings.editorSettings;
            Object.assign(this.editorSettings, this.globalEditorSettings);
        } )
    }

    editorSettingsDisposer = action( autorun( () => {
        let editorSettings = {
            fontSize: this.editorSettings.fontSize,
            fontFamily: this.editorSettings.fontFamily,
            theme: this.editorSettings.theme,
            name: this.editorSettings.name,
            height: this.editorSettings.height,
            width: this.editorSettings.width,
            mode: this.editorSettings.mode,
            enableBasicAutocompletion: this.editorSettings.enableBasicAutocompletion,
            enableLiveAutocompletion: this.editorSettings.enableLiveAutocompletion,
            enableSnippets: this.editorSettings.enableSnippets,
            blockScrolling: this.editorSettings.blockScrolling,
            wrapEnabled: this.editorSettings.wrapEnabled            
        }
        settingsStore.updateSettings(editorSettings);
    }))

    cleanUp() {
        this.editorSettingsDisposer();
    }
  
}

decorate(EditorStore, {
    editorSettings: observable,
});

export const editorStore = new EditorStore();