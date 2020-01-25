import { EventEmitter } from 'events';
import IpcRequester from "../utils/IpcRequester";
import { WSClient } from '../utils/WSClient';

class EditorDispatcher extends EventEmitter {

    // signals that the font size should increase
    //    in the code editor
    fontSizePlus() {
        this.emit("ce-font-size-plus");
    }

    // signals that the font size should decrease
    //    in the code editor
    fontSizeMinus() {
        this.emit("ce-font-size-minus");
    }

    // signals that the font size should be set
    //    to a specific size in the code editor
    fontSizeSet(size) {
        this.emit("ce-font-size-set", {size});
    }

    // signals that the font family should be set
    //    in the code editor
    fontFamilySet(font) {
        this.emit("ce-font-family-set", {font});
    }

    // signals that the theme of the code editor
    //    should be set
    themeSet(theme) {
        this.emit("ce-theme-set", {theme});
    }

    // signals that the settings of the code editor
    //    should be retrieved
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

    // signals the current code should be executed 
    runCode(){
        this.emit("run-code");
    }

    // signals that the syntax highlighting mode has changed
    modeChange(mode) {
        this.emit("mode-change", {mode});
    }

    // signals to create an empty file 
    emptyFile(){
        this.emit("empty-file");
    }

    // singals switch editor to online mode 
    openOnlineFile(){
        // get file state 
        this.emit("online-file");
    }

    //signals the Undo command
    Undo(){
        this.emit("undo");
    }

    // signals the redo command
    Redo(){
        this.emit("redo");
    }

    //signals the find command
    find(search,choice,searchType){
        console.log(searchType);
        this.emit("find",search,choice,searchType);
    }

    // signals the replace command
    replace(replace,choice){
        this.emit("replace",replace,choice);
    }

    // handle error from GHCI
    signalError(row,col){
        this.emit("error", row, col);
    }
}

export default new EditorDispatcher();