const { app } = require("electron");
const { MainProcess } = require("./electron/MainProcess");

// main method 
if(require.main === module){
    // create main process object 
    let main = new MainProcess();

    // when electron is initialized... create window 
    app.on("ready", () => {
        // app is ready - setup data .json files then window
        main.initFS()
            .catch(err => {
                // problem with setting up data files 
                console.log("Error with data file(s)...");
                console.log(err.message);
            })
            .finally(() => {
                // data fiels setup - create the app window
                main.createWindow();
            });
    });

    // handle window re-creation
    app.on("activate", () => main.createWindow());

    // kill the app when all windows closed 
    app.on("window-all-closed", () => {
        if(process.platform !== "darwin"){
            app.quit();
        }
    });

    // create menu for mac
    if(process.platform === "darwin" && !process.argv.includes("--dev")){
        main.createMenu();
    }
}