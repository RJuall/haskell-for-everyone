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
        this.emit(type, data);

        // switch for additional actions? 
    }

    // sends a formatted json request down the ipc socket
    // @param type  request type
    // @param data  additional request data  
    send(type, data){
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
}

// export singleton 
export default new IpcRequester();