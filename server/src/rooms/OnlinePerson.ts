import * as ws from "websocket";
import { EventEmitter } from "events";
import { ActionType, UpdatePosition } from "./CodeState";
import { OnlineRoom, RoomSummary } from "./OnlineRoom";
import { JsonUtils } from "../utils/JsonUtils";
import { PinGenerator } from "../utils/PinGenerator";

export type SendType = "code" | "chat" | "room-join" | "room-leave" | "room-create" | "room-list" | "id";

export type JoinCallback = (err:Error)=>void;

export const MSG_DELIM:string = "*!*";

export class OnlinePerson extends EventEmitter{
    private static readonly pinGen:PinGenerator = new PinGenerator(8);

    private _conn:ws.connection;
    private _id:string;
    private _name:string;
    private _authorized:boolean;
    private _room:OnlineRoom;

    constructor(connection:ws.connection){
        super();

        this._conn = connection;                    // websocket 
        this._id = OnlinePerson.pinGen.nextPin();   // unique session id 
        this._authorized = false;                   // must confirm version 
        this._name = null;                          // room name (can change)
        this._room = null;                          // current room 

        // event handlers 
        connection.on("close", this.onSocketClose);
        connection.on("message", this.onSocketData);
        connection.on("error", err => console.log(err.message));
    }

    // handler for when the websocket closes 
    private onSocketClose = ():void => {
        // leave room if neccessary 
        if(this.room){
            this.room.removePerson(this);
        }
        
        // free up the id when the connection ends 
        OnlinePerson.pinGen.releasePin(this._id);

        // forward the event
        this.emit("close");
    }

    // handler for when data comes through the socket 
    // @param message       socket data 
    private onSocketData = (message:ws.IMessage):void => {
        // messages can be concatenated, so split on delimiter 
        message.utf8Data.split(MSG_DELIM).forEach(json => {
            // attempt to parse each message (json expected)
            JsonUtils.parse(json, (err, obj) => {
                // successful parse? 
                if(!err){
                    // success - extract expected attributes
                    let {type, data} = obj;

                    // must have a type 
                    if(type){
                        this.emit("data", {type, data});
                    }
                }
            });
        });
    }

    // sends chat update to the client 
    // @param chat      new chat message
    // @param from      display name of sender (optional)
    public sendChat(chat:string, from?:string):void{
        this.send("chat", {chat, from});
    }

    // sends code update to the client
    // @param code      new code string
    public sendCode(code:string, start:UpdatePosition, end:UpdatePosition, action:ActionType):void{
        this.send("code", {code, start, end, action});
    }

    // sends the stored socket id to the client
    public sendId():void{
        this.send("id", {id: this.id});
    }

    // sends room list info to the client
    // @param rooms     summary of all rooms 
    public sendRoomsInfo(rooms:RoomSummary[]):void{
        this.send("room-list", {rooms})
    }

    // sends room creation update to the client
    // @param name      name of new room 
    public sendRoomCreated(name:string):void{
        this.send("room-create", {name});
    }

    // sends an error message to the client
    // @param type      operation type that failed
    // @param message   error message
    public sendError(type:SendType, message:string){
        this.send(type, {err: message});
    }

    // sends formatted json to the client through the websocket
    // @param type      operation type
    // @param data      data for the given type 
    private send(type:SendType, data?:any):void{
        // create correctly formatted json string 
        JsonUtils.stringify({type, data}, (err, str) => {
            if(!err){
                // got the string, send to the client
                // attach delimieter because possible bulk messages
                this._conn.send(str + MSG_DELIM);
            }
        });
    }

    // leaves current room 
    public leaveRoom():boolean{
        // must be in a room and room must accept leaving 
        if(this.room && this.room.removePerson(this)){
            // room name
            let name:string = this.room.name;

            // remove current room
            this._room = null;

            // inform client 
            this.send("room-leave", {name});
            return true;
        }

        // did not leave room
        this.sendError("room-leave", "Unable to leave room");
        return false;
    }

    // joins a room if not already in one 
    // @param room      room to try to join 
    // @param name      name to use 
    public joinRoom(room:OnlineRoom, name:string, callback?:JoinCallback):void{
        room.addPerson(this, err => {
            if(!err){
                // success, set current room 
                this._room = room;

                // set name 
                this.changeName(name);

                // inform client that the joined happened
                this.send("room-join", this.room.getState());
                if(callback) callback(null);
            }
            else{
                // unable to join room 
                this.sendError("room-join", err.message);
                if(callback) callback(err);
            }
        });
    }

    // authorizes a client - allowed to make requests to server 
    // (set when version is verified in exchange for id)
    public authorize():void{
        this._authorized = true;
    }

    // performs a name change, must be unique to current room 
    // @param name      new person display name 
    public changeName(name:string):void{
        // must be in a room to change the name 
        if(this.room){
            // name must be unique to the room 
            if(this.room.isNameAvailable(name)){
                // name is unique, take it
                this._name = name;
            }
            else{
                // name is NOT unique, give it a number 
                // dav taken? -> dav1... dav1 taken? -> dav2... etc
                let attempt:number = 1;
                let nameToUse:string = `${name}${attempt}`;

                while(!this.room.isNameAvailable(nameToUse)){
                    nameToUse = `${name}${++attempt}`;
                }

                this._name = nameToUse;
            }
        }
    }

    // getter for the socket id 
    public get id():string{
        return this._id;
    }

    // getter for display name 
    public get name():string{
        return this._name;
    }

    // getter for current room
    public get room():OnlineRoom{
        return this._room;
    }

    // getter for authorization status 
    public get isAuthorized():boolean{
        return this._authorized;
    }
}