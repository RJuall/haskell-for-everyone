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
}

export default new EditorDispatcher();