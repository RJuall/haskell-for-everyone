import { Request, Response } from "express";
import { RoomsManager } from "../rooms/RoomsManager";

export class RoomCodeResetHandler{
    // required query string (super secure, of course)
    private static readonly secretAuthCode:string = process.env.API_SECRET || "lichKing33";

    // rooms manager
    public static roomsManager:RoomsManager;

    // handle http get requests 
    public static get = (req:Request, res:Response):void => {
         // valid auth query string?
         if(req.query.auth !== RoomCodeResetHandler.secretAuthCode){
            res.status(403).end("Unauthorized access.");
            return;
        }

        if(!RoomCodeResetHandler.roomsManager){
            res.status(400).end("No rooms manager.");
            return;
        }
        
        // extract room name from query string
        let roomName:string = req.query.room_name || "";
        // attempt code clear
        let reset:boolean = RoomCodeResetHandler.roomsManager.resetRoomCode(roomName);
        
        // respond 
        if(reset){
            res.status(200).end(`Room "${roomName}" code has been reset.`) 
        }
        else{
            res.status(400).end(`Room "${roomName}" not found.`);
        }
    }
}