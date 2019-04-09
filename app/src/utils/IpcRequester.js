import { EventEmitter } from "events";
const { ipcRenderer } = window.require("electron");

class IpcRequester extends EventEmitter{
    constructor(){
        super();

        // listen for ipc socket data
        ipcRenderer.on("req", this.handleIpcData.bind(this));
    }

    // handles ipc socket data (updates, responses, etc)
    // @param evt   event object, used for requesting/responding
    // @param args  json string to parse
    handleIpcData(evt, args){
        // prepare to extract type, data from json
        let type, data;
        
        // attempt json parse
        try{
            // parse json
            let json = JSON.parse(args);

            // print the response data (remove this later?)
            console.log(json);

            // extract type, data
            type = json.type || null;
            data = json.data || null;
        }
        catch(err){
            // parse error
            return;
        }

        // process data if type provided (should always be)
        if(type){
            this.processIpcData(evt, type, data);
        }
    }

    // process ipc socket data (invokes listener for given type)
    // @param evt   event object, used for requesting/responding
    // @param type  request type (such as read-file)
    // @param data  additional request data (such as fileName)
    processIpcData(evt, type, data){
        switch(type){
            // parse settings before broadcasting
            case "settings-get":
                try{
                    let settings = JSON.parse(data.str);
                    this.emit(type, {settings});
                }
                catch(err){
                    break;
                }
                break;

            // trigger for any other event
            default:
                this.emit(type, data);
                break;
        }
    }

    // sends a formatted json request down the ipc socket
    // @param type  request type
    // @param data  additional request data  
    send(type, data=null){
        // attempt to create json string and send
        try{
            // json string
            let json = JSON.stringify({type, data});

            // send
            ipcRenderer.send("req", json);
        }
        catch(err){ 
            // stringify or send error - handle?
        }
    }

    // sends a formatted update settings request to the main process
    // @param update    any updated settings fields
    updateSettings({editorSettings=null, terminalSettings=null, fileSettings=null, windowSettings=null}){
        this.send("settings-update", {settings: {editorSettings, terminalSettings, fileSettings, windowSettings}});
    }

    updateEditorSettings({editorSettings}) {
        this.updateSettings({editorSettings});
    }

    updateFileSettings({fileSettings}) {
        this.updateSettings({fileSettings});
    }

    updateTerminalSettings({terminalSettings}) {
        this.updateSettings({terminalSettings});
    }

    updateWindowSettings({windowSettings}) {
        this.updateSettings({windowSettings});
    }

    // updates folder data file 
    updateFolderData({lastFilePath=null, recentFilePaths=null}){
        this.send("folder-data-update", {lastFilePath, recentFilePaths})
    }

    // tells the main process to die
    quit(){
        this.send("quit");
    }

    // sends the get settings request
    getSettings(){
        this.send("settings-get");
    }

    // sends the get folder data request
    getFolderData(){
        this.send("folder-data-get");
    }
}

// export singleton 
export default new IpcRequester();