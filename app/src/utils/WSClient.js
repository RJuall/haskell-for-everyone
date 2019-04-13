import { SERVER_ORIGIN } from "./VersionAPI";
import { Dispatcher } from "./Dispatcher";
import { VERSION } from './../components/App';

const electron = window.require("electron");

// message delimiter
export const MSG_DELIM = "*!*";

// 'enumerated' event types
export const ROOM_CREATE =  "room-create",
    ROOM_JOIN =             "room-join",
    ROOM_LEAVE =            "room-leave",
    ROOM_LIST =             "room-list",
    CHAT =                  "chat",
    CODE =                  "code",
    ID =                    "id";

export class WSClient extends Dispatcher{
    constructor(){
        super();

        this._socket =  null;   // websocket
        this._id =      null;   // socket id 
        this._room =    null;   // room data
    }

    // connects the socket 
    connect(){
        if(!this.isConnected){
            // create/connect socket 
            this._socket = new WebSocket(this.getSocketURL());

            // forward events 
            this._socket.addEventListener("open", () => {
                // request id (requires version check)
                this.send("id", {version: VERSION});

                // signal connection happened
                this.dispatch("open");
            });

            this._socket.addEventListener("close", evt => {
                // destroy id
                this._id = null;

                // signal socket closed 
                this.dispatch("close");
            });

            // handle errors
            this._socket.addEventListener("error", evt => this.dispatch("error"));

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

        // some updates includes state updates about the connection 
        switch(type){
            case ID:
                this._id = data.id;
                console.log(`I'm socket id ${data.id}`);
                break;

            case ROOM_JOIN:
                this._room = {...data};
                break;

            case ROOM_LEAVE:
                this._room = null;
                break;
        }
    }

    // requests a room to be created for user
    // @param roomName  room to create
    // @param userName  name to assign self in room 
    createRoom(roomName, userName, {accessType=null, editType=null, password=null}){
        this.send(ROOM_CREATE, {roomName, userName, accessType, editType, password});
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
    // @param row       insertion row
    // @param col       insertion col
    // @param action    insert or remove 
    sendCode(code, row, col, action){
        if(this._room){
            if(this._room.editType === "anyone" || this._room.owner === this.id){
                this.send(CODE, {code, row, col, action});
            }
        }
    }

    // sends formatted json message
    // @param type      message type
    // @param data      message data
    send(type, data=null){
        if(!this.isConnected){
            this.dispatch({type, data: {err: "Not connected to server."}});
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
        let env = electron.remote.process.env;

        if(typeof env.WS_URI === "string"){
            return env.WS_URI;
        }

        if(window.location.origin.includes("localhost")){
            return "ws://localhost:8080";
        }
        return SERVER_ORIGIN;
    }

    // getter for is connected to server
    get isConnected(){
        return this._socket && this._socket.readyState === 1;
    }

    // getter for server-assigned socket id 
    get id(){
        return this._id
    }
}

// export singleton 
export default new WSClient();