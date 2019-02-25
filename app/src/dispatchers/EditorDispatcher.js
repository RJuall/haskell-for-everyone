import { EventEmitter } from 'events';

class EditorDispatcher extends EventEmitter {

    fontSizePlus() {
        this.emit("font-size-plus");
    }

    fontSizeMinus() {
        this.emit("font-size-minus");
    }
}

export default new EditorDispatcher();