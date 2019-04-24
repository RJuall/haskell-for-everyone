import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, Button } from "reactstrap";
import ModalDispatcher, { CREATE_ROOM_MODAL } from "../dispatchers/ModalDispatcher";
import WSClient, { ROOM_CREATE } from "../utils/WSClient";
import { SelectFileFolder } from "../utils/SelectFileFolder";
import { FileExtension } from "../utils/FileExtension";
import FileDispatcher from "../dispatchers/FileDispatcher";

export class ModalCreateRoom extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isOpen:     false,          // modal visibility 
            locked:     false,          // UI input lock 
            access:     "public",       // public/private access
            edit:       "owner-only",   // owner-only/anyone editing
            filePath:   null            // initial file path (null = none selected)
        };

        this.roomNameInput = null;  // room name <input>
        this.userNameInput = null;  // user name <input>
        this.accessInput =   null;  // access type <input> 
        this.passwordInput = null;  // room passowrd <input>
        this.descInput =     null;  // description <input>
        this.editInput =     null;  // edit type <input>
        this.wsCallbackId = -1;     // wsclient callback id 
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    // shows the modal when the UI is triggered
    handleCreateRoomModal = () => {
        this.setState({isOpen: true, access: "public"});
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
            editType =      this.editInput.value,
            description =   this.descInput.value,
            filePath =      this.state.filePath || null;

        // send request 
        if(filePath){
            // start room with file
            FileDispatcher.readFileSilently(filePath, str => {
                WSClient.createRoom(roomName, userName, {password, accessType, editType, description, initialCode: str});
            });
            return;
        }

        // start room with no file 
        WSClient.createRoom(roomName, userName, {password, accessType, editType, description});
    }

    onFileClick = () => {
        SelectFileFolder.selectFileDialog(filePaths => {
            if(filePaths){
                this.setState({filePath: filePaths[0]});
            }
        });
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
                innerRef={input => this.passwordInput = input}
                type="text"
                placeholder="Enter passcode"
                minLength={3}
                maxLength={16}
                required
            />
            </>
        ) : null;
    }

    render(){
        let {isOpen, locked, filePath} = this.state;

        return (
            <Modal isOpen={isOpen} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>
                    Create Room
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <Label>Your Name</Label>
                            <InputGroup>
                                <Input
                                    innerRef={elem => this.userNameInput = elem}
                                    type="text"
                                    minLength={2}
                                    maxLength={16}
                                    disabled={locked}
                                    required
                                />
                                <InputGroupAddon>
                                    {WSClient.id}
                                </InputGroupAddon>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label>Room Name</Label>
                            <Input
                                innerRef={elem => this.roomNameInput = elem}
                                type="text"
                                minLength={3}
                                maxLength={16}
                                disabled={locked}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Room Description</Label>
                            <Input
                                type="text"
                                maxLength={32}
                                innerRef={elem => this.descInput = elem}
                                placeholder="Optional description"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Initial File</Label>
                            <br/>
                            <Button type="button" disabled={locked} onClick={this.onFileClick}>
                                {filePath ? "Change" : "Select"}
                            </Button>
                            &nbsp; {filePath ? FileExtension.fileNameFromPath(filePath) : "No file selected (optional)"}
                        </FormGroup>
                        <FormGroup>
                            <Label>Editing</Label>
                            <Input type="select" innerRef={input => this.editInput = input}>
                                <option value="anyone">Anyone can edit</option>
                                <option value="owner-only">Only owner can edit</option>
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