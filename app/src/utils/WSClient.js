import { SERVER_ORIGIN } from "./VersionAPI";
import { Dispatcher } from "./Dispatcher";

// message delimiter
export const MSG_DELIM = "*!*";

// 'enumerated' event types
export const ROOM_CREATE =  "room-create",
    ROOM_JOIN =             "room-join",
    ROOM_LEAVE =            "room-leave",
    ROOM_LIST =             "room-list",
    CHAT =                  "chat",
    CODE =                  "code";

export class WSClient extends Dispatcher{
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
            this._socket.addEventListener("open", () => this.dispatch("open"));
            this._socket.addEventListener("errot", () => this.dispatch("error"));
            this._socket.addEventListener("close", () => this.dispatch("close"));

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
    handleSocketData = evt => {
        // split messages (can be concat!) on delimiter
        evt.data.toString().split(MSG_DELIM).forEach(msg => {
            // parse json and extract type/data
            let type, data;
            try{
                // parse json string
                let json = JSON.parse(msg);
                console.log("socketdata", json);
            
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
        this.dispatch({type, data});
    }

    // requests a room to be created for user
    // @param roomName  room to create
    // @param userName  name to assign self in room 
    createRoom(roomName, userName){
        this.send(ROOM_CREATE, {roomName, userName});
    }

    // joins an existing room
    // @param roomName  room to join (by unique name)
    // @param userName  name to assign self in room
    joinRoom(roomName, userName){
        if(this.isConnected){
            this.send(ROOM_JOIN, {roomName, userName});
        }
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
            this.dispatch({type, err: "Not connected to server."});
            return;
        }

        try{
            // expected schema {type: "something", data: {})
            // *!* is message delimiter (tcp sometimes send packets concatenated)
            this._socket.send(JSON.stringify({type, data}) + MSG_DELIM);
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
        return this._socket && this._socket.readyState === 1;
    }
}

// export singleton 
export default new WSClient();