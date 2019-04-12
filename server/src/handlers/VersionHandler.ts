import { Request, Response } from "express";
import * as fs from "fs";
import { CORS } from "../utils/CORS";
import { JsonUtils } from './../utils/JsonUtils';

export class VersionHandler{
    // cached copy of current version 
    private static _version:string = null;

    // getter for the discovered version 
    public static get version():string{
        return this._version;
    }

    // finds version and caches 
    public static findVersion():void{
        // load the package file (contains the version)
        fs.readFile("./app/package.json", (err, buf) => {
            if(!err){
                // got the json... now parse
                JsonUtils.parse(buf.toString(), (err, obj) => {
                    if(!err && obj.version){
                        // parse complete and version found - set the version
                        this._version = obj.version;
                    }
                });
            }
            else{
                // can't find package.json
                console.log("(Unable to locate client version - can't find app/package.json)");
            }
        });
    }

    // handler for http options requests 
    public static options = (req:Request, res:Response):void => {
        res.writeHead(200, CORS.headers);
        res.end();
    }

    // handler for http get requests 
    public static get = (req:Request, res:Response):void => {
        res.writeHead(200, CORS.headers);
        res.end(VersionHandler.version);
    }
}

// initially find the version 
VersionHandler.findVersion();