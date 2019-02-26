import { EventEmitter } from 'events';

class EditorDispatcher extends EventEmitter {

    fontSizePlus() {
        this.emit("ce-font-size-plus");
    }

    fontSizeMinus() {
        this.emit("ce-font-size-minus");
    }

    fontSizeSet() {
        this.emit("ce-font-size-set");
    }

    fontFamilySet() {
        this.emit("ce-font-family-set");
    }

    themeSet() {
        this.themeSet("ce-theme-set");
    }
}

export default new EditorDispatcher();