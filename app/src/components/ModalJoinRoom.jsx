import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Button } from "reactstrap";
import ModalDispatcher, { JOIN_ROOM_MODAL } from "../dispatchers/ModalDispatcher";
import WSClient, { ROOM_JOIN, ROOM_LIST } from "../utils/WSClient";

export class ModalJoinRoom extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isOpen:     false,      // modal visibility 
            roomsList:  null        // list of joinable rooms 
        };

        this.userNameInput = null;  // user name <input> 
        this.roomNameInput = null;  // room name <input>
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
    handleRoomJoinResponse = evt => {
        if(this.state.isOpen){
            if(!evt.err){
                // room created! 
                ModalDispatcher.alertModal("Room Joined", "You are in an online room.");
            }
            else{
                // error creating room
                ModalDispatcher.alertModal("Join Room Error", evt.err);
            }
        }
    }

    // handler for rooms list response
    handleRoomListResponse = evt => {
        if(this.state.isOpen){
            if(!evt.err){
                this.setState({roomsList: evt.roomsList || []});
            }
            else{
                this.setState({roomsList: []});
                ModalDispatcher.alertModal("Rooms List Error", `Unable to load available rooms: ${evt.err}`);
            }
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
            WSClient.joinRoom(roomName, userName);
        }

        // close the modal
        this.setState({isOpen: false});
    }

    componentDidMount(){
        // listen for modal trigger
        ModalDispatcher.on(JOIN_ROOM_MODAL, this.handleJoinRoomModal);
        // listen for join response
        WSClient.on(ROOM_JOIN, this.handleRoomJoinResponse);
        // listen for room list 
        WSClient.on(ROOM_LIST, this.handleRoomListResponse);
    }

    componentWillUnmount(){
        // stop listening for modal trigger
        ModalDispatcher.removeListener(JOIN_ROOM_MODAL, this.handleJoinRoomModal);
        // stop listening for join response
        WSClient.removeListener(ROOM_JOIN, this.handleRoomJoinResponse);
        // stop listening for room list 
        WSClient.removeListener(ROOM_LIST, this.handleRoomListResponse);
    }

    renderRoomsListInput(){
        let {roomsList=null} = this.state;

        if(!roomsList){
            return <div className="text-center">Fetching rooms...</div>;
        }

        return (
            <Input type="select" innerRef={elem => this.roomNameInput = elem}>
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
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Available Rooms</Label>
                            {this.renderRoomsListInput()}
                        </FormGroup>
                        <div>
                            <Button>Join</Button>
                        </div>
                    </Form>
                    <br/>
                    <div>
                        This will create an online room with you as the owner.
                        Room name is required to be unique. 
                        Online connection is required.
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}