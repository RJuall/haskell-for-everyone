import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, Button } from "reactstrap";
import ModalDispatcher, { CREATE_ROOM_MODAL } from "../dispatchers/ModalDispatcher";
import WSClient, { ROOM_CREATE } from "../utils/WSClient";

export class ModalCreateRoom extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isOpen: false,          // modal visibility 
            locked: false,          // UI input lock 
            access: "public",       // public/private access
            edit:   "owner-only"    // owner-only/anyone editing
        };

        this.roomNameInput = null;  // room name <input>
        this.userNameInput = null;  // user name <input>
        this.accessInput =   null;  // access type <input> 
        this.passwordInput = null;  // room passowrd <input>
        this.editInput =     null;  // edit type <input>
        this.wsCallbackId = -1;     // wsclient callback id 
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    // shows the modal when the UI is triggered
    handleCreateRoomModal = () => {
        this.setState({isOpen: true});
    }

    // handles server response for creating the room 
    handleRoomCreateResponse = ({err, name}) => {
        if(!err){
            // room created! 
            // (no alert since you immediately get joined modal!)
            // ModalDispatcher.alertModal("Room Created", `Your online room "${name}" has been created.`);
            this.setState({isOpen: false, locked: false});
        }
        else{
            // error creating room
            ModalDispatcher.alertModal("Create Room Error", err);
            this.setState({isOpen: false, locked: false});
        }

        // unlock UI 
        this.setState({locked: false});
    }

    // handle websocket client update
    handleWsClientUpdate = ({type, data}) => {
        switch(type){
            case ROOM_CREATE:
                this.handleRoomCreateResponse(data);
                break;
        }
    }

    // form submission 
    onSubmit = evt => {
        // prevent page refresh 
        evt.preventDefault();

        // lock modal input 
        this.setState({locked: true});

        // get string values from html 
        let roomName =      this.roomNameInput.value,
            userName =      this.userNameInput.value,
            password =      this.passwordInput ? this.passwordInput.value : null,
            accessType =    this.accessInput.value,
            editType =      this.editInput.value;

        // send request 
        WSClient.createRoom(roomName, userName, {password, accessType, editType});
    }

    componentDidMount(){
        // listen for modal trigger
        ModalDispatcher.on(CREATE_ROOM_MODAL, this.handleCreateRoomModal);
        
        // listen for room creation response 
        this.wsCallbackId = WSClient.register(this.handleWsClientUpdate);
    }

    componentWillUnmount(){
        // stop listening for modal trigger
        ModalDispatcher.removeListener(CREATE_ROOM_MODAL, this.handleCreateRoomModal);

        // stop listening for room creation response
        WSClient.unregister(this.wsCallbackId);
    }

    renderPasswordInput(){
        return this.state.access !== "public" ? (
            <>
            <br/>
            <Input
                type="text"
                placeholder="Enter passcode"
                maxLength={16}
                required
            />
            </>
        ) : null;
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
                                minLength={3}
                                maxLength={16}
                                disabled={this.state.locked}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Your Name</Label>
                            <InputGroup>
                                <Input
                                    innerRef={elem => this.userNameInput = elem}
                                    type="text"
                                    minLength={3}
                                    maxLength={16}
                                    disabled={this.state.locked}
                                    required
                                />
                                <InputGroupAddon>
                                    {WSClient.id}
                                </InputGroupAddon>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label>Editing</Label>
                            <Input type="select" innerRef={input => this.editInput = input}>
                                <option value="owner-only">Only owner can edit</option>
                                <option value="anyone">Anyone can edit</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>Access</Label>
                            <Input
                                type="select"
                                innerRef={input => this.accessInput = input}
                                onChange={evt => this.setState({access: evt.target.value})}
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </Input>
                            {this.renderPasswordInput()}
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