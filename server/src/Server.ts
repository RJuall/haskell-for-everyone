import * as express from "express";
import * as http from "http";
import * as https from "https";
import { MongoClient } from "mongodb";
import * as websocket from "websocket";
import { ContactUsGetHandler } from "./handlers/ContactUsGetHandler";
import { ContactUsSubmitHandler } from "./handlers/ContactUsSubmitHandler";
import { VersionHandler } from "./handlers/VersionHandler";
import { DatabaseManager } from "./database/DatabaseManager";
import { RoomsManager } from "./rooms/RoomsManager";

export class Server{
    private _app:express.Application; 
    private _httpServer:http.Server;  
    private _wsServer:websocket.server;
    private _rooms:RoomsManager;
    private _dbManager:DatabaseManager;

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

        // when a websocket tries to connect...
        this._wsServer.on("request", this.handleWebSocket.bind(this));

        // app serves static files and accepts json
        this._app.use(express.static(`${__dirname}/../../web`)).use(express.json());

        // templates 
        this._app.set("view engine", "pug");
        this._app.set("views", `${__dirname}/../views`);

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
        this._app.get("/", (req, res) => res.sendFile("index.html"));
        
        // contact us form submission
        this._app.post("/contact/submit", ContactUsSubmitHandler.post);

        // view form submissions 
        this._app.get("/contact/get", ContactUsGetHandler.get);

        // api for version
        this._app.options("/api/version*", VersionHandler.options);
        this._app.get("/api/version/get", VersionHandler.get);

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
                console.log("Seriously, you don't have mongodb!? :(");
            }

             // listen on PORT environment variable or default 
            let port:number = parseInt(process.env.PORT) || 8080;
            this._httpServer.listen(port, () => {
                console.log(`Server listening on port ${port}.`);
            });
        });
    }
}

// main method
if(require.main === module){
    new Server();
}