import { settingsStore } from '../utils/SettingsStore';
import { decorate, autorun, observable, action, computed } from 'mobx';
import { editorDefaults } from './defaults/EditorDefaults';

class EditorStore {

    constructor(props) {
        this.globalEditorSettings = settingsStore.getEditorSettings;

        this.editorSettings = {
            fontSize: this.globalEditorSettings.fontSize || editorDefaults.fontSize,
            fontFamily: this.globalEditorSettings.fontFamily || editorDefaults.fontFamily,
            theme: this.globalEditorSettings.theme || editorDefaults.theme,
            name: this.globalEditorSettings.name || editorDefaults.name,
            height: this.globalEditorSettings.height || editorDefaults.height,
            width: this.globalEditorSettings.width || editorDefaults.width,
            mode: this.globalEditorSettings.mode || editorDefaults.mode,
            enableBasicAutocompletion: this.globalEditorSettings.enableBasicAutocompletion || editorDefaults.enableBasicAutocompletion,
            enableLiveAutocompletion: this.globalEditorSettings.enableLiveAutocompletion || editorDefaults.enableLiveAutocompletion,
            enableSnippets: this.globalEditorSettings.enableSnippets || editorDefaults.enableSnippets,
            blockScrolling: this.globalEditorSettings.blockScrolling || editorDefaults.blockScrolling,
            wrapEnabled: this.globalEditorSettings.wrapEnabled || editorDefaults.wrapEnabled,
        }
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
            wrapEnabled: this.editorSettings.wrapEnabled,            
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