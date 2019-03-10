"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var CORS_1 = require("../utils/CORS");
var JsonUtils_1 = require("./../utils/JsonUtils");
var VersionHandler = (function () {
    function VersionHandler() {
    }
    VersionHandler.findVersion = function () {
        var _this = this;
        fs.readFile("./app/package.json", function (err, buf) {
            if (!err) {
                JsonUtils_1.JsonUtils.parse(buf.toString(), function (err, obj) {
                    if (!err && obj.version) {
                        _this.version = obj.version;
                    }
                });
            }
            else {
                console.log("(Unable to locate client version - can't find app/package.json)");
            }
        });
    };
    VersionHandler.version = null;
    VersionHandler.options = function (req, res) {
        res.writeHead(200, CORS_1.CORS.headers);
        res.end();
    };
    VersionHandler.get = function (req, res) {
        res.writeHead(200, CORS_1.CORS.headers);
        res.end(VersionHandler.version);
    };
    return VersionHandler;
}());
exports.VersionHandler = VersionHandler;
VersionHandler.findVersion();
