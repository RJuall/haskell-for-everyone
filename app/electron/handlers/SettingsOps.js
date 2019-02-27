const { SettingsData } = require("../utils/SettingsData");
const { JsonParser } = require("../utils/JsonParser");
const { IpcResponder } = require("../utils/IpcResponder");

class SettingsOps{
    // responds to a set/update settings request
    // @param evt       event object for responding 
    // @param settings  settings to apply 
    static updateSettings(evt, {settings=null}){
        // must have settings 
        if(!settings){
            let err = "No settings provided (settings is null).";
            IpcResponder.respond(evt, "settings-get", {err});
            return;
        }

        // update the settings file 
        SettingsData.update(settings, err => {
            if(!err){
                IpcResponder.respond(evt, "settings-update");
            }
            else{
                // error updating file - this should probably never happen! 
                IpcResponder.respond(evt, "settings-update", {err: err.message});
            }
        });
    }

    // responds to a get settings request
    // @param evt       event object for responding 
    static getSettings(evt){
        // parse and send the settings as json 
        JsonParser.parse(SettingsData.settings, (err, str) => {
            if(!err){
                // send settings json
                IpcResponder.respond(evt, "settings-get", {str});
            }
            else{
                // error with parsing settings json
                // (should never happen!)
                IpcResponder.respond(evt, "settings-get", {err: err.message});
            }
        });
    }
}

module.exports = { SettingsOps };