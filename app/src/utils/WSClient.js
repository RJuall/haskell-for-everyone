import { EventEmitter } from "events";
import { SERVER_ORIGIN } from "./VersionAPI";

// message delimiter
export const MSG_DELIM = "*!*";

// 'enumerated' event types
export const ROOM_CREATE =  "room-create",
    ROOM_JOIN =             "room-join",
    ROOM_LEAVE =            "room-leave",
    ROOM_LIST =             "room-list",
    CHAT =                  "chat",
    CODE =                  "code";

export class WSClient extends EventEmitter{
    constructor(){
        super();

        this._socket = null;    // websocket
    }

    // connects the socket 
    connect(){
        if(!this.isConnected){
            // create/connect socket 
            this._socket = new WebSocket(this.getSocketURL());

            // forward events 
            this._socket.addEventListener("open", evt => this.emit("open", evt));
            this._socket.addEventListener("errot", evt => this.emit("error", evt));
            this._socket.addEventListener("close", evt => this.emit("close", evt));

            // handle socket data
            this._socket.addEventListener("message", this.handleSocketData);
        }
    }

    // close socket 
    close(){
        if(this._socket){
            this._socket.close();
        }
    }

    // handle socket data 
    // @param evt       socket message event 
    handleSocketData(evt){
        // split messages (can be concat!) on delimiter
        evt.data.toString().split(MSG_DELIM).forEach(msg => {
            // parse json and extract type/data
            let type, data;
            try{
                // parse json string
                let json = JSON.parse(msg);
            
                // extract type/data from json
                ({type=null, data=null} = json);

                // must have a type 
                if(!type){
                    return;
                }
            }
            catch(err){
                // json parse error
                return;
            }

            // process parsed message
            this.processSocketData(type, data);
        });
    }

    // process data from the socket
    // @param type      socket message type
    // @param data      socket message data
    processSocketData(type, data){
        // emit updates 
        this.emit(type, data);
    }

    // requests a room to be created for user
    // @param roomName  room to create
    // @param userName  name to assign self in room 
    createRoom(roomName, userName){
        this.send("room-create", {roomName, userName});
    }

    // joins an existing room
    // @param roomName  room to join (by unique name)
    // @param userName  name to assign self in room
    joinRoom(roomName, userName){
        if(this.isConnected)
        this.send(ROOM_JOIN, {roomName, userName});
    }

    // exits current room
    leaveRoom(){
        this.send(ROOM_LEAVE);
    }

    // gets the name all rooms
    fetchRoomList(){
        this.send(ROOM_LIST);
    }

    // sends chat update
    // @param chat      chat text message
    sendChat(chat){
        this.send(CHAT, {chat});
    }

    // sends code update
    // @param code      code to send
    sendCode(code){
        // do we need filename? 
        this.send(CODE, {code});
    }

    // sends formatted json message
    // @param type      message type
    // @param data      message data
    send(type, data=null){
        if(!this.isConnected){
            this.emit(type, {err: "Not connected to server."});
            return;
        }

        try{
            // expected schema {type: "something", data: {})
            // *!* is message delimiter (tcp sometimes send packets concatenated)
            this.socket.send(JSON.stringify({type, data}) + MSG_DELIM);
        }
        catch(err){
            return;
        }
    }

    // getter for websocket connection url 
    getSocketURL(){
        if(window.location.origin.includes("localhost")){
            return "ws://localhost:8080";
        }
        return SERVER_ORIGIN;
    }

    // getter for is connected to server
    get isConnected(){
        return this.socket && this.socket.readyState === 1;
    }
}

// export singleton 
export default new WSClient();