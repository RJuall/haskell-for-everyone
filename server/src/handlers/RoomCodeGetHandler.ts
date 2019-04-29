import { Request, Response } from "express";
import { RoomsManager } from "../rooms/RoomsManager";
import { JsonUtils } from "../utils/JsonUtils";

export class RoomCodeGetHandler{
    // required query string
    private static readonly secretAuthCode:string = process.env.API_SECRET || "lichKing33";

    // rooms manager
    public static roomsManager:RoomsManager;

    // handle http get requests 
    public static get = (req:Request, res:Response):void => {
         // valid auth query string?
         if(req.query.auth !== RoomCodeGetHandler.secretAuthCode){
            res.status(403).end("Unauthorized access.");
            return;
        }

        if(!RoomCodeGetHandler.roomsManager){
            res.status(400).end("No rooms manager.");
            return;
        }
        
        // extract room name from query string
        let roomName:string = req.query.room_name || "";
        // attempt code retrieval
        let code:string[] = RoomCodeGetHandler.roomsManager.getRoomCode(roomName);
        
        // respond 
        if(code){
            JsonUtils.stringify(code, (err, json) => {
                if(!err){
                    res.setHeader("content-type", "text/json");
                    res.status(200).end(json);
                }
                else{
                    res.status(500).end();
                }
            }, true);
        }
        else{
            res.status(400).end(`Room "${roomName}" not found.`);
        }
    }
}