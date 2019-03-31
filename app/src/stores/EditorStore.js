import { settingsStore } from '../utils/SettingsStore';
import { computed, decorate, autorun, observable } from 'mobx';
import { observer } from 'mobx-react';
import { editorDefaults } from './defaults/EditorDefaults';

class EditorStore {

    globalEditorSettings = settingsStore.getEditorSettings;

    editorSettings = {
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

    editorSettingsDisposer = autorun( () => {
        settingsStore.updateSettings(this.editorSettings);
    })

    cleanUp() {
        this.editorSettingsDisposer();
    }

    test() {
        console.log("editorSettings");
    }    
}

decorate(EditorStore, {
    editorSettings: observable,
});

export const editorStore = new EditorStore();