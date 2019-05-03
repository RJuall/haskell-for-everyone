import * as express from "express";
import * as http from "http";
import * as https from "https";
import * as path from "path";
import * as fs from "fs";
import { MongoClient } from "mongodb";
import * as websocket from "websocket";
import { ContactUsGetHandler } from "./handlers/ContactUsGetHandler";
import { ContactUsSubmitHandler } from "./handlers/ContactUsSubmitHandler";
import { RoomCodeResetHandler } from "./handlers/RoomCodeResetHandler";
import { VersionHandler } from "./handlers/VersionHandler";
import { DatabaseManager } from "./database/DatabaseManager";
import { RoomsManager } from "./rooms/RoomsManager";
import { RoomCodeGetHandler } from "./handlers/RoomCodeGetHandler";

export class Server{
    private _app:express.Application; 
    private _httpServer:http.Server;  
    private _wsServer:websocket.server;
    private _rooms:RoomsManager;
    private _dbManager:DatabaseManager;
    private _indexHtml:string;

    constructor(){
        // express handles requests
        this._app = express();
        // http server - express app handles 
        this._httpServer = http.createServer(this._app);
        // websocket server
        this._wsServer = new websocket.server({httpServer: this._httpServer});
        // create rooms 
        this._rooms = new RoomsManager();
        // database manager
        this._dbManager = null;
        // index page has special templatea
        this._indexHtml = "";

        // when a websocket tries to connect...
        this._wsServer.on("request", this.handleWebSocket.bind(this));

        // templates 
        this._app.set("view engine", "pug");
        this._app.set("views", path.join(__dirname, "../views"));

        // json body middleware 
        this._app.use(express.json());

        // handlers can access rooms
        RoomCodeResetHandler.roomsManager = this._rooms;
        RoomCodeGetHandler.roomsManager = this._rooms

        // start server
        this.createRoutes();
        this.init();
    }

    // handle websocket connections 
    private handleWebSocket(req:websocket.request):void{
        // accept connection
        let conn:websocket.connection = req.accept(null, "*");

        // enroll connection into rooms system 
        this._rooms.enrollPerson(conn);
    }

    // http routing
    private createRoutes():void{
        // serve index page at root  
        this._app.get("/", (req, res) => {
            res.status(200).end(this._indexHtml);
        });
        
        // contact us form submission
        this._app.post("/contact/submit", ContactUsSubmitHandler.post);

        // view form submissions 
        this._app.get("/contact/get", ContactUsGetHandler.get);

        // api for room resets
        this._app.get("/api/room/reset", RoomCodeResetHandler.get);

        // api for room code 
        this._app.get("/api/room/code", RoomCodeGetHandler.get);

        // api for version
        this._app.options("/api/version*", VersionHandler.options);
        this._app.get("/api/version/get", VersionHandler.get);

         // app serves static files
         this._app.use(express.static(path.join(__dirname, "../../web")));

        // 404 error page
        this._app.use((req, res) => {
            res.sendFile("404.html", {root: "./web"});
        });
    }

    // starts the server
    private init():void{
        // mongodb connection url
        let mongoUri:string = process.env.MONGODB_URI || "mongodb://localhost:27017/haskell_for_everyone";

        // connect to mongo
        console.log("Connecting to database...");
        MongoClient.connect(mongoUri, {useNewUrlParser: true} ,(err, client) => {
            if(!err){
                // connected
                this._dbManager = new DatabaseManager(client);
                ContactUsSubmitHandler.dbManager = this._dbManager;
                ContactUsGetHandler.dbManager = this._dbManager;
                console.log("Connected to MongoDB.\n");
            }
            else{
                // failed to connect
                console.log("MongoDB ERR: " + err.message);
                console.log("(Allowing to server to run without database)\n");
                console.log("Use MONGODB_URI env var to configure.");
                console.log("Seriously, you don't have mongodb!? :(\n");
            }

            // load downloads page and replace verison 
            console.log("Loading downloads page for templating...");
            fs.readFile(path.join(__dirname, "../../web/index.html"), (err, buf) => {
                if(!err){
                    // setup version
                    this._indexHtml = buf.toString().replace(/({{ version }})/g, VersionHandler.version);
                    console.log("Downloads page using correct version label.\n");
                }
                else console.log("Error loading downloads page (THIS IS BAD)\n");

                // listen on PORT environment variable or default 
                let port:number = parseInt(process.env.PORT) || 8080;
                this._httpServer.listen(port, () => {
                    console.log(`Server listening on port ${port}.`);
                });
            });
        });
    }
}

// main method
if(require.main === module){
    new Server();
}