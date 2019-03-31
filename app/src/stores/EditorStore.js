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
        name: editorDefaults.name,
        
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