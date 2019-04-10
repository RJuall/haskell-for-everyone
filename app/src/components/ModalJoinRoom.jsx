import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Button } from "reactstrap";
import ModalDispatcher, { JOIN_ROOM_MODAL } from "../dispatchers/ModalDispatcher";
import WSClient, { ROOM_JOIN, ROOM_LIST } from "../utils/WSClient";

export class ModalJoinRoom extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isOpen:     false,      // modal visibility 
            roomsList:  null,       // list of joinable rooms 
            locked:     false       // UI input lock 
        };

        this.userNameInput = null;  // user name <input> 
        this.roomNameInput = null;  // room name <input>

        this.wsCallbackId = -1;     // wsclient callback id
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    // shows the modal 
    handleJoinRoomModal = () => {
        this.setState({isOpen: true, roomsList: null}, () => {
            // get names of all joinable rooms 
            WSClient.fetchRoomList();
        });
    }

    // handler for response to room join request 
    handleRoomJoinResponse = ({err=null}) => {
        if(!err){
            // room created! 
            ModalDispatcher.alertModal("Room Joined", "You are in an online room.");
        }
        else{
            // error creating room
            ModalDispatcher.alertModal("Join Room Error", err);
        }

        // unlock UI 
        this.setState({locked: false});
    }

    // handler for rooms list response
    handleRoomListResponse = ({err=null, roomsList=[]}) => {
        if(this.state.isOpen){
            if(!err){
                this.setState({roomsList});
            }
            else{
                this.setState({roomsList: []});
                ModalDispatcher.alertModal("Rooms List Error", `Unable to load available rooms: ${err}`);
            }
        }
    }

    // handler for websocket update 
    handleWsClientUpdate = payload => {
        switch(payload.type){
            case ROOM_JOIN:
                this.handleRoomJoinResponse(payload);
                break;

            case ROOM_LIST:
                this.handleRoomListResponse(payload);
                break;
        }
    }

    onSubmit = evt => {
        // prevent page refresh
        evt.preventDefault();

        // get string values from html 
        let roomName = this.roomNameInput.value,
            userName = this.userNameInput.value;

        // send request 
        if(roomName){
            this.setState({locked: true});
            WSClient.joinRoom(roomName, userName);
        }
    }

    componentDidMount(){
        // listen for modal trigger
        ModalDispatcher.on(JOIN_ROOM_MODAL, this.handleJoinRoomModal);
        
        // listen for websocket updates
        this.wsCallbackId = WSClient.register(this.handleWsClientUpdate)
    }

    componentWillUnmount(){
        // stop listening for modal trigger
        ModalDispatcher.removeListener(JOIN_ROOM_MODAL, this.handleJoinRoomModal);

        // stop listening  for websocket updates
        WSClient.unregister(this.wsCallbackId);
    }

    renderRoomsListInput(){
        let {roomsList=null} = this.state;

        // rooms are loading still
        if(!roomsList){
            return <div className="text-center">Fetching rooms...</div>;
        }

        // nothing found
        if(!roomsList.length){
            return <div className="text-center">No available rooms found.</div>
        }

        // rooms found - show selection 
        return (
            <Input type="select" innerRef={elem => this.roomNameInput = elem} disabled={this.state.locked}>
                {roomsList}
            </Input>
        )
    }

    render(){
        return (
            <Modal isOpen={this.state.isOpen} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>
                    Join Room
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <Label>Your Name</Label>
                            <Input
                                innerRef={elem => this.userNameInput = elem}
                                type="text"
                                maxLength={16}
                                disabled={this.state.locked}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Available Rooms</Label>
                            {this.renderRoomsListInput()}
                        </FormGroup>
                        <div>
                            <Button disabled={this.state.locked}>Join</Button>
                        </div>
                    </Form>
                    <br/>
                    <div>
                        This will connect you to an existing online room.
                        Your name is required to be unique. 
                        Online connection is required.
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}