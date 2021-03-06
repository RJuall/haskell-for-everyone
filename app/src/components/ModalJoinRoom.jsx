import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText, Button } from "reactstrap";
import ModalDispatcher, { JOIN_ROOM_MODAL } from "../dispatchers/ModalDispatcher";
import WSClient, { ROOM_JOIN, ROOM_LIST } from "../utils/WSClient";

export class ModalJoinRoom extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isOpen:         false,      // modal visibility 
            roomsList:      null,       // list of joinable rooms 
            filter:         null,       // room list filter
            showPassword:   false,      // show password input (private selection)
            locked:         false       // UI input lock 
        };

        this.userNameInput =    null;   // user name <input> 
        this.roomNameInput =    null;   // room name <input>
        this.filterInput =      null;   // filter <input>
        this.passwordInput =    null;   // password <input>

        this.wsCallbackId = -1;         // wsclient callback id
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    // shows the modal 
    handleJoinRoomModal = () => {
        this.setState({isOpen: true, roomsList: null, filter: null, showPassword: false}, () => {
            // get names of all joinable rooms 
            WSClient.fetchRoomList();
        });
    }

    // handler for response to room join request 
    handleRoomJoinResponse = ({err=null, name=null}) => {
        if(!err){
            // room created! 
            // ModalDispatcher.alertModal("Room Joined", `You are in room "${name}".`);
            this.setState({isOpen: false});
        }
        else{
            // error creating room
            ModalDispatcher.alertModal("Join Room Error", err);
        }

        // unlock UI 
        this.setState({locked: false});
    }

    // handler for rooms list response
    handleRoomListResponse = ({err=null, rooms=[]}) => {
        if(this.state.isOpen){
            if(!err){
                this.setState({roomsList: rooms});
            }
            else{
                this.setState({roomsList: []});
                ModalDispatcher.alertModal("Rooms List Error", `Unable to load available rooms: ${err}`);
            }
        }
    }

    // handler for websocket update 
    handleWsClientUpdate = ({type, data}) => {
        switch(type){
            case ROOM_JOIN:
                this.handleRoomJoinResponse(data);
                break;

            case ROOM_LIST:
                this.handleRoomListResponse(data);
                break;
        }
    }

    onSubmit = evt => {
        // prevent page refresh
        evt.preventDefault();

        // don't allow submissions while fetching 
        if(!this.roomNameInput) return;

        // get string values from html 
        let roomName = this.roomNameInput.value,
            userName = this.userNameInput.value,
            password = this.passwordInput ? this.passwordInput.value : null;

        // send request 
        if(roomName){
            this.setState({locked: true});
            WSClient.joinRoom(roomName, userName, password);
        }
    }

    onRoomChange = evt => {
        let selection = evt.target;
        let option = selection[selection.selectedIndex];
        let accessType = option.getAttribute("accesstype");

        let showPassword = (accessType === "private");

        this.setState({showPassword});
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

    renderFilterInput(){
        let {roomsList=null} = this.state;

        return (roomsList && roomsList.length) ? (
            <>
            <Input
                innerRef={input => this.filterInput = input}
                onChange={evt => this.setState({filter: evt.target.value})}
                placeholder="Optional filter"
                maxLength={25}
            />
            <br/>
            </>
        ) : null;
    }

    renderPasswordFormGroup(){
        return this.state.showPassword ? (
            <FormGroup>
                <Label>Password</Label>
                <Input
                    innerRef={input => this.passwordInput = input}
                    placeholder="Enter private room password"
                    minLength={1}
                    maxLength={16}
                    required
                />
            </FormGroup>
        ) : null;
    }

    renderRoomsListInput(){
        let {roomsList=null, filter=null} = this.state;

        // rooms are loading still
        if(!roomsList){
            return <div className="text-center">Fetching rooms...</div>;
        }

        // nothing found
        if(!roomsList.length){
            return <div className="text-center">No available rooms found.</div>
        }

        // rooms found - apply optional filter
        let filteredRooms = roomsList;
        if(filter){
            // case insensitive
            filter = filter.toLowerCase();

            filteredRooms = roomsList.filter(({name}) => {
                return name.toLowerCase().includes(filter);
            });
        }
        
        // create room option elements
        let options = filteredRooms.map(({name, size, accessType, editType, description}) => {
            return (
                <option key={name} value={name} accesstype={accessType}>
                    {name}&nbsp;
                    ({size} {size !== 1 ? "people" : "person"})&nbsp;
                    {description}
                </option>
            );
        });

        // show filtered list or no match text 
        return options.length ? (
            <Input type="select" innerRef={elem => this.roomNameInput = elem} disabled={this.state.locked} onChange={this.onRoomChange}>
                {options}
            </Input>
        ) : <div>Nothing matches your search.</div>
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
                            <InputGroup>
                                <Input
                                    innerRef={elem => this.userNameInput = elem}
                                    type="text"
                                    minLength={2}
                                    maxLength={16}
                                    disabled={this.state.locked}
                                    required
                                />
                                <InputGroupAddon addonType="append">
                                    {WSClient.id}
                                </InputGroupAddon>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label>Available Rooms</Label>
                            {this.renderRoomsListInput()}
                        </FormGroup>
                        <div>
                            {this.renderFilterInput()}
                        </div>
                        {this.renderPasswordFormGroup()}
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