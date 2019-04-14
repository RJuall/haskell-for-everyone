import * as express from "express";
import * as http from "http";
import * as https from "https";
import * as websocket from "websocket";
import { VersionHandler } from "./handlers/VersionHandler";
import { RoomsManager } from "./rooms/RoomsManager";

export class Server{
    private _app:express.Application; 
    private _httpServer:http.Server;  
    private _wsServer:websocket.server;
    private _rooms:RoomsManager;

    constructor(){
        // express handles requests - also serves static pages
        this._app = express().use(express.static(`${__dirname}/../../web`));
        // http server - express app handles 
        this._httpServer = http.createServer(this._app);
        // websocket server
        this._wsServer = new websocket.server({httpServer: this._httpServer});
        // create rooms 
        this._rooms = new RoomsManager();

        // when a websocket tries to connect...
        this._wsServer.on("request", this.handleWebSocket.bind(this));

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

        // api for version
        this._app.options("/api/version*", VersionHandler.options);
        this._app.get("/api/version/get", VersionHandler.get);
    }

    // starts the server
    private init():void{
        // listen on PORT environment variable or default 
        let port:number = parseInt(process.env.PORT) || 8080;
        this._httpServer.listen(port, () => {
            console.log(`Server listening on port ${port}.`);
        });
    }
}

// main method
if(require.main === module){
    new Server();
}