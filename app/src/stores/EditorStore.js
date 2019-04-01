import { settingsStore } from '../utils/SettingsStore';
import { decorate, autorun, observable } from 'mobx';
import { editorDefaults } from './defaults/EditorDefaults';
import { observer, inject } from 'mobx-react';

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
        this.props.settingsStore.settings = {editorSettings: this.editorSettings.get()};
        console.log("ed set auto ran" + this.editorSettings.get());
    })

    cleanUp() {
        this.editorSettingsDisposer();
    }
  
}

decorate(EditorStore, {
    editorSettings: observable,
});

export const editorStore = new EditorStore();