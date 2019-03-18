import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Button } from "reactstrap";
import ModalDispatcher, { CREATE_ROOM_MODAL } from "../dispatchers/ModalDispatcher";
import WSClient, { ROOM_CREATE } from "../utils/WSClient";

export class ModalCreateRoom extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isOpen: false,           // modal visibility 
            locked: false            // UI input lock 
        };

        this.roomNameInput = null;  // room name <input>
        this.userNameInput = null;  // user name <input
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    // shows the modal when the UI is triggered
    handleCreateRoomModal = () => {
        this.setState({isOpen: true});
    }

    // handles server response for creating the room 
    handleRoomCreateResponse = evt => {
        if(!evt.err){
            // room created! 
            ModalDispatcher.alertModal("Room Created", "You online room is now live.");
        }
        else{
            // error creating room
            ModalDispatcher.alertModal("Create Room Error", evt.err);
        }

        // unlock UI 
        this.setState({locked: false});
    }

    // form submission 
    onSubmit = evt => {
        // prevent page refresh 
        evt.preventDefault();

        // lock modal input 
        this.setState({locked: true});

        // get string values from html 
        let roomName = this.roomNameInput.value,
            userName = this.userNameInput.value;

        // send request 
        WSClient.createRoom(roomName, userName);
    }

    componentDidMount(){
        // listen for modal trigger
        ModalDispatcher.on(CREATE_ROOM_MODAL, this.handleCreateRoomModal);
        // listen for room creation response 
        WSClient.on(ROOM_CREATE, this.handleRoomCreateResponse);
    }

    componentWillUnmount(){
        // stop listening for modal trigger
        ModalDispatcher.removeListener(CREATE_ROOM_MODAL, this.handleCreateRoomModal);
        // stop listening for room creation response
        WSClient.removeListener(ROOM_CREATE, this.handleRoomCreateResponse);
    }

    render(){
        return (
            <Modal isOpen={this.state.isOpen} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>
                    Create Room
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <Label>Room Name</Label>
                            <Input
                                innerRef={elem => this.roomNameInput = elem}
                                type="text"
                                maxLength={16}
                                disabled={this.state.locked}
                                required
                            />
                        </FormGroup>
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
                        <div>
                            <Button disabled={this.state.locked}>Create</Button>
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