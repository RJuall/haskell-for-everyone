const { app, BrowserWindow, ipcMain } = require("electron");
const { JsonParser } = require("./utils/JsonParser");
const { FileOps } = require("./handlers/FileOps");

class MainProcess{
    constructor(){
        this.window = null;
        this.devMode = false;

        // listen for incoming requests from the ipc socket  
        ipcMain.on("req", this.handleIpcData.bind(this));
    }

    // creates the app window 
    createWindow(){
        if(this.window) return;

        // the app window 
        this.window = new BrowserWindow({
            title:  "Haskell For Everyone",
            width:  1280,
            height: 720
        });

        // dev mode? 
        let devMode = process.argv.includes("--dev");
        let url = devMode ? "http://localhost:3000" : `file://${__dirname}/../build/index.html`;
        
        // store dev mode 
        this.devMode = devMode;

        // load app in electron browser 
        this.window.loadURL(url);

        // when window closed
        this.window.on("closed", () => this.window = null);
    }

    // handles ipc socket request (json string)
    // @param evt   event object, used for responding
    // @param arg   request json string 
    handleIpcData(evt, arg){
        // parse json from socket 
        JsonParser.parse(arg, (err, json) => {
            if(!err){
                // log request 
                if(this.devMode) console.log(json);
                
                // parsed - extract type & data
                let {type=null, data=null} = json;

                // process if type exists (data is optional)
                if(type){
                    this.processIpcRequest(evt, type, data);
                }
            }
        });
    }

    // process the request sent via ipc socket
    processIpcRequest(event, type, data){
        // call "handler" function based on request type
        switch(type){
            case "get-files":
                FileOps.getFileNames(event, data.dir);
                break;

            case "read-file":
                FileOps.readFile(event, data.fileName);
                break;

            case "write-file":
                FileOps.writeFile(event, data.fileName, data.str);
                break;
                
            default:
                break;
        }
    }
}

// main method 
if(require.main === module){
    // create main process object 
    let main = new MainProcess();

    // when electron is initialized... create window 
    app.on("ready", () => main.createWindow());

    // handle window re-creation
    app.on("activate", () => main.createWindow());

    // kill the app when all windows closed 
    app.on("window-all-closed", () => {
        if(process.platform !== "darwin"){
            app.quit();
        }
    });
}

module.exports = { MainProcess };