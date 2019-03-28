import StoreManager from '../utils/StoreManager';
import { computed, decorate } from 'mobx';

export default class EditorStore {

    get editorSettings() {
        return StoreManager.settings.editorSettings;
    }

    editorSettings = this.editorSettings();

    fontSize = editorSettings.fontSize || '20px';
    fontFamily = editorSettings.fontFamily || 'Inconsolata';
    theme = editorSettings.theme || 'dracula';

    test() {
        console.log("editorSettings");
    }    
}

decorate(EditorStore, {
    editorSettings: computed,
});