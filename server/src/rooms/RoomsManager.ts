import * as ws from "websocket";
import { OnlineRoom, OnlineRoomOptions, RoomSummary, AccessType, EditType } from "./OnlineRoom";
import { OnlinePerson, SendType } from "./OnlinePerson";
import { VersionHandler } from "../handlers/VersionHandler";

export type CreateRoomCallback = (err:Error, room:OnlineRoom)=>void;

export class RoomsManager{
    private _people:Map<string, OnlinePerson>
    private _rooms:Map<string, OnlineRoom>;

    constructor(){
        this._people = new Map();
        this._rooms = new Map();
        
        // create test rooms
        this.createTestRoom("Test: Northrend");
        this.createTestRoom("Test: Isengard");
        this.createTestRoom("Test: Mustafar");
    }

    // creates a room in the system, must have a unique name
    // @param name          name of the new room
    // @param owner         owner of the room
    // @param ownerName     display name for the owner
    // @param options       additional room options
    // @param callback      error handling callback 
    public createRoom(name:string, owner:OnlinePerson, ownerName:string, options:OnlineRoomOptions, callback:CreateRoomCallback){
        // can't create a room while in one
        if(owner && owner.room){
            callback(new Error(`Can't create a room while in one.`), null);
            return;
        }

        // enforce unique name 
        if(this._rooms.has(name)){
            callback(new Error(`Name "${name}" already taken.`), null);
            return;
        }

        // safe to create room (automatically adds owner)
        let room:OnlineRoom = new OnlineRoom(name, owner, ownerName, options);
        this._rooms.set(name, room);

        // room created
        callback(null, room);
    }

    // creates a test room (never dies, no owner)
    // @param name          name of the test room 
    private createTestRoom(name:string):void{
        this.createRoom(name, null, null, {}, () => {});
    }

    // enters a person into the room system 
    // @param connection    websocket connection     
    public enrollPerson(connection:ws.connection):void{
        // wrap the connection in a 'person'
        let person:OnlinePerson = new OnlinePerson(connection);

        // listen for incoming data
        person.on("data", ({type, data}) => {
            this.handlePersonData(person, type, data);
        });

        // store person in the people map, key is their unique id  
        this._people.set(person.id, person);
    }

    // handles requests made by the person (websocket)
    // @param person        the peron whos websocket is sending data
    // @param type          request type
    // @param data          additional request information (specific to type)
    private handlePersonData(person:OnlinePerson, type:SendType, data:any):void{
        //console.log(type, data);

        // non-authorized people must request authorization only 
        if(!person.isAuthorized){
            // authorization request? (id type = exchange credentials for id)
            if(type === "id"){
                this.processGetId(person, data);
            }
            else return;
        }

        // authorized people can make more requests 
        switch(type){
            case "chat":
                this.processChat(person, data);
                break;

            case "code":
                this.processCode(person, data);
                break;

            case "room-leave":
                this.processRoomLeave(person);
                break;

            case "room-join":
                this.processRoomJoin(person, data);
                break;

            case "room-create":
                this.processRoomCreate(person, data);
                break;

            case "room-list":
                this.processRoomList(person);
                break;
        }
    }

    // connection is requesting it's socket id
    // @param person        person making the request
    // @param version       client version must be provided
    private processGetId(person:OnlinePerson, {version=""}):void{
        if(version && version == VersionHandler.version){
            // valid version, authorize and give id
            person.authorize();
            person.sendId();
        }
        else{
            // bad version
            person.sendError("id", "Wrong application version.");
        }
    }

    // connection has requested to leave current room
    // @param person        person making the request
    private processRoomLeave(person:OnlinePerson):void{
        // must be in a room
        if(!person.room) return;

        // leave
        person.leaveRoom();
    }

    // connection has requested to join a room
    // @param person        person making the request 
    // @param roomName      room to join by unique name
    // @param userName      person's display name for that room
    // @param password      private room password (only needed for private rooms)
    private processRoomJoin(person:OnlinePerson, {roomName="", userName="", password=""}):void{
        // must have room name and user name 
        if(!roomName || !userName){
            person.sendError("room-join", "Invalid request parameters (userName and roomName required).");
            return;
        }

        // must not be in a room
        if(person.room){
            person.sendError("room-join", "You cannot join a room - you are already in one.");
            return;
        }

        // try to find room by name provided
        let room:OnlineRoom = this._rooms.get(roomName);
        if(room){
            // validate password if neccessary 
            if(room.accessType === "public" || room.checkPassword(password)){
                // public room or correct password - attempt to join
                person.joinRoom(room, userName, err => {
                    if(err){
                        // unable to join (err object has specific reason why)
                        person.sendError("room-join", err.message);
                    }
                });
            }
            else{
                // password is required and it was wrong
                person.sendError("room-join", "Access denied: wrong password.");
            }
        }
        else{
            // room not found 
            person.sendError("room-join", "Room not found.");
        }
    }

    // connection has requested a new room to be created
    // @param person        person making the request
    // @param roomName      new room name to make
    // @param userName      person's display name in the new room
    // @param accessType    public or private room (optional)
    // @param editType      edit permissions (optional)
    // @param password      password for private room (optional)
    private processRoomCreate(person:OnlinePerson, {roomName="", userName="", accessType=null, editType=null, password=null}):void{
        // must have room name and display name
        if(!roomName || !userName){
            person.sendError("room-create", "Invalid request parameters (roomName and userName required).");
            return;
        }

        // must not be in a room
        if(person.room){
            person.sendError("room-create", "You cannot create a room while you are in one.");
            return;
        }

        // default configurations
        accessType = accessType || "public";
        editType = editType || "anyone";

        // attempt to create the room
        this.createRoom(roomName, person, userName, {accessType, editType, password}, (err, room) => {
            if(!err){
                // room was created
                //person.changeName(userName);

                // kill room when empty 
                room.on("empty", () => {
                    room.removeAllListeners();
                    this._rooms.delete(room.name);
                    room = null;
                });
            }
            else{
                // error - room not created (err object has specific reason why)
                person.sendError("room-create", err.message);
            }
        });
    }

    // connection is requesting available rooms
    // @param person        person making the request 
    private processRoomList(person:OnlinePerson):void{
        // prepare to gather summaries 
        let rooms:RoomSummary[] = new Array(this._rooms.size);
        let idx:number = 0;

        // for each room, put its summary in the array
        this._rooms.forEach(room => {
            rooms[idx++] = room.getSummary();
        });

        // send the room summaries 
        person.sendRoomsInfo(rooms);
    }

    // connection has posted a chat message
    // @param person        person making the request
    // @param chat          the chat message
    private processChat(person:OnlinePerson, {chat=""}):void{
        // must be in a room
        if(!person.room) return;

        // send the message to the entire room 
        person.room.broadcastChat(chat, person.name);
    }

    // connection has posted a code state update
    // @param person        person making the request
    // @param code          code update (string)
    // @param start         start position of code update
    // @param end           end position of code update
    // @param action        insert or remove action 
    private processCode(person:OnlinePerson, {code="", start=null, end=null, action=null}):void{
        // must be in a room
        if(!person.room) return;

        // must be correctly formatted
        if(!code || !start || !end || !action) return;

        // apply the update 
        person.room.updateCode(code, start, end, action, person);
    }
}