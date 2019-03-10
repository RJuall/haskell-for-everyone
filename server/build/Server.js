"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var http = require("http");
var websocket = require("websocket");
var VersionHandler_1 = require("./handlers/VersionHandler");
var Server = (function () {
    function Server() {
        this._app = express().use(express.static(__dirname + "/../../web"));
        this._httpServer = http.createServer(this._app);
        this._wsServer = new websocket.server({ httpServer: this._httpServer });
        this._wsServer.on("request", this.handleWebSocket.bind(this));
        this.createRoutes();
        this.init();
    }
    Server.prototype.handleWebSocket = function (req) {
        var conn = req.accept(null, "*");
    };
    Server.prototype.createRoutes = function () {
        this._app.get("/", function (req, res) { return res.sendFile("index.html"); });
        this._app.options("/api/version*", VersionHandler_1.VersionHandler.options);
        this._app.get("/api/version/get", VersionHandler_1.VersionHandler.get);
    };
    Server.prototype.init = function () {
        var port = parseInt(process.env.PORT) || 8080;
        this._httpServer.listen(port, function () {
            console.log("Server listening on port " + port + ".");
        });
    };
    return Server;
}());
exports.Server = Server;
if (require.main === module) {
    new Server();
}
