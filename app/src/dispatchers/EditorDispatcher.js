import { EventEmitter } from 'events';

class EditorDispatcher extends EventEmitter {

    fontSizePlus() {
        this.emit("font-size-plus");
        console.log("THISWORKS");
    }

}

export default new EditorDispatcher();