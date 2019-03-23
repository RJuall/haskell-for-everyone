const { app } = require("electron");
const { FileUtils } = require("../utils/FileUtils");
const { JsonParser } = require("../utils/JsonParser");

const SETTINGS_FILE = process.argv.includes("--dev") ? "./settings.json" : app.getPath("userData") + "/settings.json";

const FONT_SIZE_INTERVAL = 2;

class SettingsData{
    constructor(){
        // default private fields 
        this._settings = {
            editorSettings: {
                fontSize: "20px",
                fontFamily: "Inconsolata, Fira Code, monospace",
                theme: "dracula"
            },
            terminalSettings: {
                placeHolder: null
            },
            fileSettings: {
                placeHolder: null
            },
            windowSettings: {
                windowTheme: "light"
            }
        }
    }

    init(){
        return new Promise((resolve, reject) => {
            // read current settings file 
            this.loadFile()
                .then(json => {
                    // load settings from file
                    this._settings.editorSettings = Object.assign(this._settings.editorSettings, json.editorSettings)
                    this._settings.terminalSettings = Object.assign(this._settings.terminalSettings, json.terminalSettings)
                    this._settings.fileSettings = Object.assign(this._settings.fileSettings, json.fileSettings)
                    this._settings.windowSettings = Object.assign(this._settings.windowSettings, json.windowSettings)
               
                    resolve(this);
                })
                .catch(err => {
                    // failed to load (keeps current/default options)
                    if(err.errno === -4058 || err.errno === -2){
                        // missing file - write defaults 
                        this.updateFile(err => err ? reject(err) : resolve(this));
                    }
                    else reject(err);
                });
        })
    }

    // loads the current settings file 
    loadFile(){
        return new Promise((resolve, reject) => {
            // read file 
            FileUtils.readFile(SETTINGS_FILE)
                .then(str => {
                    // parse json
                    JsonParser.parse(str, (err, json) => {
                        //console.log(`file=`, str);
                        err ? reject(err) : resolve(json);
                    });
                })
                .catch(err => reject(err));
        });
    }

    // updates the settings file
    // @param callback  (optional) callback for when file write resolves 
    updateFile(callback){
        // stringify the settings object
        JsonParser.stringifyPretty(this._settings, (err, str) => {
            if(!err){
                // update the json file 
                FileUtils.writeFile(SETTINGS_FILE, str).catch(err => {
                    // update file error 
                    console.log(`Settings file write error: ${err.message}`);

                    // resolve optional callback
                    if(typeof callback === "function"){
                        callback(err || null);
                    }
                });
            }
            else if(typeof callback === "function"){
                callback(new Error("Settings file: error parsing json."));
            }
        });
    }

    // updates multiple settings at once 
    // @param settings{}    all settings file parameters 
    // @param callback      optional callback for when update finishes
    update({editorSettings=null, terminalSettings=null, fileSettings=null, windowSettings=null}, callback=null){

        if(editorSettings)
            Object.assign(this._settings.editorSettings, editorSettings);

        if(terminalSettings)
            Object.assign(this._settings.terminalSettings, terminalSettings);

        if(fileSettings)
            Object.assign(this._settings.fileSettings, fileSettings);

        if(windowSettings)
            Object.assign(this._settings.windowSettings, windowSettings);
        
        this.updateFile(callback);
    }

    // increase font size by predefined interval
    // @param callback      optional callback for when update finishes
    incrementFontSize(callback){
        this.setFontSize(this._settings.editorSettings.fontSize + FONT_SIZE_INTERVAL, callback);
    }

    // decreases font size by predefined interval
    // @param callback      optional callback for when update finishes
    decrementFontSize(callback){
        this.setFontSize(this._settings.editorSettings.fontSize - FONT_SIZE_INTERVAL, callback);
    }

    // setter for the font size
    // @param fontSize      new font size (string or number)
    // @param callback      optional callback for when update finishes
    setFontSize(fontSize, callback=null){
        this._settings.editorSettings.fontSize = parseInt(fontSize) + "px";
        this.updateFile(callback)
    }

    // setter for the font family
    // @param fontFamily    new font family string
    // @param callback      optional callback for when update finishes
    setFontFamily(fontFamily, callback=null){
        this._settings.editorSettings.fontFamily = fontFamily;
        this.updateFile(callback);
    }

    // setter for the theme
    // @param theme         new theme string
    // @param callback      optional callback for when update finishes
    setTheme(theme, callback=null){
        this._settings.editorSettings.theme = theme;
        this.updateFile(callback);
    }

    // getter for the font size
    get fontSize(){
        return this._settings.editorSettings.fontSize;
    }

    // getter for the font family
    get fontFamily(){
        return this._settings.editorSettings.fontFamily;
    }

    // getter for the theme
    get theme(){
        return this._settings.editorSettings.theme;
    }

    // getting for all settings in a object
    get settings(){
        return {
            windowSettings: {...this._settings.windowSettings},
            fileSettings: {...this._settings.fileSettings},
            editorSettings: {...this._settings.editorSettings},
            terminalSettings: {...this._settings.terminalSettings}
        };
    }
}

module.exports = { SettingsData: new SettingsData() };