import React from 'react';
import ModalDispatcher from '../dispatchers/ModalDispatcher';
import EditorDispatcher from '../dispatchers/EditorDispatcher';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import WSClient from '../utils/WSClient';
import './MenuBar.css';

export class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: false,
            edit: false,
            preference: false,
            rooms: false
        };
    }

    // Toggle for the file dropdown
    toggleFile(){
        this.setState({file: !this.state.file});
    }

    // Toggle for the edit dropdown
    toggleEdit(){
        this.setState({edit: !this.state.edit});
    }

    // Toggle for preferences dropdown
    togglePreferences(){
        this.setState({preference: !this.state.preference});
    }

    toogleRooms(){
        this.setState({rooms: !this.state.rooms});
    }

    render() {
        return(
            <div className="nav">					
                <Dropdown nav isOpen={this.state.file} toggle={this.toggleFile.bind(this)}>
                    <DropdownToggle nav className="menuItem"> 
                        File 
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => ModalDispatcher.createFileModal()}>New File</DropdownItem>
                        <DropdownItem onClick={() => ModalDispatcher.selectFileModal()}>Open File</DropdownItem>
                        <DropdownItem onClick={() => ModalDispatcher.selectFolderModal()}>Open Folder</DropdownItem>
                        <DropdownItem onClick={() => ModalDispatcher.saveFileAsModal()}>Save As</DropdownItem>
                        <DropdownItem onClick={() => EditorDispatcher.saveCurrentFile()}>Save</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => EditorDispatcher.runCode()}>Run</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown nav isOpen={this.state.edit} toggle={this.toggleEdit.bind(this)}>
                    <DropdownToggle nav className="menuItem"> 
                        Edit 
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => document.execCommand("paste")}>Paste</DropdownItem>
                        <DropdownItem onClick={() => document.execCommand("copy")}>Copy</DropdownItem>
                        <DropdownItem onClick={() => document.execCommand("cut")}>Cut</DropdownItem>
                        <DropdownItem>Find</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => document.execCommand("redo")}>Redo</DropdownItem>
                        <DropdownItem onClick={() => document.execCommand("undo")}>Undo</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown nav isOpen={this.state.preference} toggle={this.togglePreferences.bind(this)}>
                    <DropdownToggle nav className="menuItem"> 
                        Preferences 
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>Appearance</DropdownItem>
                        <DropdownItem>Editor Layout</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown nav isOpen={this.state.rooms} toggle={this.toogleRooms.bind(this)}>
                    <DropdownToggle nav className="menuItem">
                        Online
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => ModalDispatcher.createRoomModal()}>Create Room</DropdownItem>
                        <DropdownItem onClick={() => ModalDispatcher.joinRoomModal()}>Join Room</DropdownItem>
                        <DropdownItem onClick={() => WSClient.leaveRoom()}>Quit Room</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    }
}
