import React from "react";
import { RoomChat } from "./RoomChat";
import { RoomEmpty } from "./RoomEmpty";
import WSClient, { ROOM_LEAVE, ROOM_JOIN } from "../utils/WSClient";
import "./RoomContainer.css";

export class RoomContainer extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            inRoom: false
        };

        this.wsCallbackId = -1;

        
        // '1' key to toggle state for testing, **** REMOVE THIS LATER ****
        /*window.addEventListener("keyup", evt => {
            if(evt.key === "1"){
                this.setState({inRoom: !this.state.inRoom});
            }
        })*/
    }

    handleRoomLeave = ({err}) => {
        if(err) return;

        this.setState({inRoom: false});
    }

    handleRoomJoin = ({err}) => {
        if(err) return;

        this.setState({inRoom: true});
    }

    handleWsClientUpdate = payload => {
        switch(payload.type){
            case ROOM_LEAVE:
                this.handleRoomLeave(payload);
                break;

            case ROOM_JOIN:
                this.handleRoomJoin(payload);
                break;
        }
    }

    componentDidMount(){
        this.wsCallbackId = WSClient.register(this.handleWsClientUpdate);
    }

    componentWillUnmount(){
        WSClient.unregister(this.wsCallbackId);
    }

    render(){
        return (
            <div className="room-container">
                { this.state.inRoom ? <RoomChat/> : <RoomEmpty/> }
            </div>
        );
    }
}