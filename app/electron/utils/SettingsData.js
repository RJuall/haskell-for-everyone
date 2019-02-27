const { FileUtils } = require("../utils/FileUtils");
const { JsonParser } = require("../utils/JsonParser");

const SETTINGS_FILE = "settings.json";

const FONT_SIZE_INTERVAL = 2;

class SettingsData{
    constructor(){
        // default private fields 
        this._fontSize = "20px";
        this._fontFamily = "Operator Mono, Fira Code, Lucida Console, Courier, monospace";
        this._theme = "darcula";

        // read current settings file 
        this.loadFile()
            .then(json => {
                // load settings from file
                this.fontSize = json.fontSize || this.fontSize;
                this.fontFamily = json.fontFamily || this.fontFamily;
                this.theme = json.theme || this.theme;
            })
            .catch(err => {
                // failed to load (keeps current/default options)
                if(err.errno === -4058){
                    // missing file - write defaults 
                    this.updateFile();
                }
            });
    }

    // loads the current settings file 
    loadFile(){
        return new Promise((resolve, reject) => {
            // read file 
            FileUtils.readFile(SETTINGS_FILE)
                .then(str => {
                    // parse json
                    JsonParser.parse(str, (err, json) => {
                        console.log(`file=`, str);
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
        JsonParser.stringifyPretty(this.settings, (err, str) => {
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
    update({fontSize=null, fontFamily=null, theme=null}, callback=null){
        // update fontSize?
        if(typeof fontSize === "number" || typeof fontSize === "string")
            this._fontSize = fontSize;

        // update fontFamily?
        if(typeof fontFamily === "string")
            this._fontFamily = fontFamily;

        // update theme?
        if(typeof theme === "string")
            this._theme = theme;

        // update the file 
        this.updateFile(callback);
    }

    // increase font size by predefined interval
    // @param callback      optional callback for when update finishes
    incrementFontSize(callback){
        this.setFontSize(this.fontSize + FONT_SIZE_INTERVAL, callback);
    }

    // decreases font size by predefined interval
    // @param callback      optional callback for when update finishes
    decrementFontSize(callback){
        this.setFontSize(this.fontSize - FONT_SIZE_INTERVAL, callback);
    }

    // setter for the font size
    // @param fontSize      new font size (string or number)
    // @param callback      optional callback for when update finishes
    setFontSize(fontSize, callback=null){
        this._fontSize = parseInt(fontSize) + "px";
        this.updateFile(callback)
    }

    // setter for the font family
    // @param fontFamily    new font family string
    // @param callback      optional callback for when update finishes
    setFontFamily(fontFamily, callback=null){
        this._fontFamily = fontFamily;
        this.updateFile(callback);
    }

    // setter for the theme
    // @param theme         new theme string
    // @param callback      optional callback for when update finishes
    setTheme(theme, callback=null){
        this._theme = theme;
        this.updateFile(callback);
    }

    // getter for the font size
    get fontSize(){
        return this._fontSize;
    }

    // getter for the font family
    get fontFamily(){
        return this._fontFamily;
    }

    // getter for the theme
    get theme(){
        return this._theme;
    }

    // getting for all settings in a object
    get settings(){
        return {
            fontSize:   this.fontSize,
            fontFamily: this.fontFamily,
            theme:      this.theme
        };
    }
}

module.exports = { SettingsData: new SettingsData() };