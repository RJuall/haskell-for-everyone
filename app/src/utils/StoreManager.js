import { EventEmitter } from "events";
import { observable } from 'mobx';
import IpcRequester from './IpcRequester';
import { EditorStore } from '../stores/EditorStore';

class StoreManager {
    settings = {};

    constructor(props) {
        IpcRequester.on("settings-get", evt => Object.assign(this.settings, evt.settings));
        IpcRequester.getSettings();
    }

    createStores() {
        console.log(this.settings);
    }
}

export default new StoreManager().createStores();