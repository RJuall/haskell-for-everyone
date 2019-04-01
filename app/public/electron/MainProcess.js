const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const { JsonParser } = require("./utils/JsonParser");
const { FileOps } = require("./handlers/FileOps");
const { GhciOps } = require("./handlers/GhciOps");
const { FolderOps } = require("./handlers/FolderOps");
const { SettingsOps } = require("./handlers/SettingsOps");
const { FolderData } = require ("./utils/FolderData");
const { SettingsData } = require("./utils/SettingsData");

class MainProcess{
    constructor(){
        this.window = null;
        this.devMode = false;

        // listen for incoming requests from the ipc socket  
        ipcMain.on("req", this.handleIpcData.bind(this));
    }

    // initialzes file-dependent data 
    initFS(){
        return Promise.all([
            SettingsData.init(),
            FolderData.init()
        ]);
    }

    // creates the app window 
    createWindow(){
        if(this.window) return;

        // the app window 
        this.window = new BrowserWindow({
            title:  "Haskell For Everyone",
            width:  1280,
            height: 720,
            show: false,
            backgroundColor: "black"
        });

        // dev mode? 
        let devMode = process.argv.includes("--dev");
        let url = devMode ? "http://localhost:3000" : `file://${__dirname}/../index.html`;
        
        // store dev mode 
        this.devMode = devMode;

        // load app in electron browser 
        this.window.loadURL(url);

        // when window closed
        this.window.on("closed", () => this.window = null);

        // show window when ready
        this.window.on("ready-to-show", () => {
            this.window.show();
            this.window.focus();
        });
    }

    // creates the electron application menu
    // has simple edit and quit commands
    createMenu(){
        // create menu object from template
        let appMenu = Menu.buildFromTemplate([
            {
                label: "Haskell For Everyone",
                submenu: [{
                    label: "Quit",
                    accelerator: "CmdOrCtrl+Q",
                    click: () => app.quit()
                }]
            },
            {
                label: "Edit",
                submenu: [
                    {
                        label:          "Undo",
                        accelerator:    "CmdOrCtrl+Z",
                        selector:       "undo:"
                    },
                    {
                        label:          "Redo",
                        accelerator:    "Shift+CmdOrCtrl+Z",
                        selector:       "redo:"
                    },
                    {type: "separator"},
                    {
                        label:          "Cut",
                        accelerator:    "CmdOrCtrl+X",
                        selector:       "cut:"
                    },
                    {
                        label:          "Copy",
                        accelerator:    "CmdOrCtrl+C",
                        selector:       "copy:"
                    },
                    {
                        label:          "Paste",
                        accelerator:    "CmdOrCtrl+V",
                        selector:       "paste:"
                    },
                    {
                        label:          "Select All",
                        accelerator:    "CmdOrCtrl+A",
                        selector:       "selectAll:"
                    }
                ]
            }
        ]);
    
        // set the menu 
        Menu.setApplicationMenu(appMenu);
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
    processIpcRequest(evt, type, data){
        // call "handler" function based on request type
        switch(type){
            case "files-get":
                FileOps.getFileNames(evt, data);
                break;

            case "files-recent":
                FileOps.getRecentFiles(evt, data);
                break;

            case "file-read":
                FileOps.readFile(evt, data);
                break;

            case "file-write":
                FileOps.writeFile(evt, data);
                break;

            case "file-create":
                FileOps.createFile(evt, data);
                break;

            case "ghci":
                GhciOps.executeCode(evt, data);
                break;

            case "ghci-file":
                GhciOps.executeFile(evt, data);
                break;

            case "ghci-clear":
                GhciOps.clear(evt);
                break;

            case "ghci-init":
                GhciOps.init(evt);
                break;

            case "folder-add":
                FolderOps.addFolder(evt, data);
                break;

            case "folder-remove":
                FolderOps.removeFolder(evt, data);
                break;

            case "folder-reset":
                FolderOps.resetFolders(evt);
                break;

            case "folder-list":
                FolderOps.getFolderPaths(evt);
                break;

            case "settings-update":
                SettingsOps.updateSettings(evt, data);
                break;

            case "settings-get":
                SettingsOps.getSettings(evt);
                break;
                
            default:
                break;
        }
    }
}

module.exports = { MainProcess };