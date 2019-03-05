import { EventEmitter } from 'events';
import IpcRequester from "../utils/IpcRequester";

class EditorDispatcher extends EventEmitter {

    fontSizePlus() {
        this.emit("ce-font-size-plus");
    }

    fontSizeMinus() {
        this.emit("ce-font-size-minus");
    }

    fontSizeSet(size) {
        this.emit("ce-font-size-set", {size});
    }

    fontFamilySet(font) {
        this.emit("ce-font-family-set", {font});
    }

    themeSet(theme) {
        this.emit("ce-theme-set", {theme});
    }

    getCurrentSettings() {
        this.emit("ce-current-settings-get");
    }

    // signals that the current file should be saved 
    saveCurrentFile() {
        this.emit("editor-save-file");
    }

    // signals a save as should be trigged with the current editor code
    // @param path       new file directory with name
    saveAs(path){
        this.emit("save-as", {path});
    }
}

export default new EditorDispatcher();