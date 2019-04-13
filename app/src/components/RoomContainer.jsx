import React from "react";
import { RoomChat } from "./RoomChat";
import { RoomSetup } from "./RoomSetup";
import WSClient, { ROOM_LEAVE, ROOM_JOIN } from "../utils/WSClient";
import "./RoomContainer.css";

export class RoomContainer extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isConnected:    false,  // connected to server?
            roomName:       null    // name of room (null or "" means no room)
        };

        this.wsCallbackId = -1;
    }

    handleRoomLeave = ({err, name}) => {
        if(err) return;

        this.setState({roomName: null});
    }

    handleRoomJoin = ({err, name}) => {
        if(name){
            this.setState({roomName: name});
        }
    }

    // this happens when disconnection occurs 
    handleSocketClose = () => {
        this.setState({roomName: null, isConnected: false});
    }

    handleSocketConnect = () => {
        this.setState({isConnected: true});
    }

    handleWsClientUpdate = ({type, data}) => {
        switch(type){
            case ROOM_LEAVE:
                this.handleRoomLeave(data);
                break;

            case ROOM_JOIN:
                this.handleRoomJoin(data);
                break;

            case "close":
                this.handleSocketClose();
                break;

            case "open":
                this.handleSocketConnect();
                break;
        }
    }

    componentDidMount(){
        this.wsCallbackId = WSClient.register(this.handleWsClientUpdate);

        WSClient.connect();
    }

    componentWillUnmount(){
        WSClient.unregister(this.wsCallbackId);
    }

    render(){
        return (
            <div className="room-container">
                { this.state.roomName ? <RoomChat roomName={this.state.roomName}/> : <RoomSetup isConnected={this.state.isConnected}/> }
            </div>
        );
    }
}