const { app, BrowserWindow, ipcMain } = require("electron");

class MainProcess{
    constructor(){
        this.window = null;
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
        
        // load app in electron browser 
        this.window.loadURL(url);

        // when window closed
        this.window.on("closed", () => this.window = null);
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