import React from 'react';
import ModalDispatcher from '../dispatchers/ModalDispatcher';
import EditorDispatcher from '../dispatchers/EditorDispatcher';
import IpcRequester from '../utils/IpcRequester';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import './MenuBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/pro-regular-svg-icons';
import { SelectFileFolder } from '../utils/SelectFileFolder';
import { RecentFiles } from './RecentFiles';


export class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: false,
            edit: false,
            preference: false,
            appearance: false,
            background: false,
            value: false,
            bc : "Toggle Light Background"
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

    // Toggle appearence when selected
    toggleAppearance(){
        this.setState({appearance: !this.state.appearance})
    }

    // Toggle Dropdown for background color
    toggleBackground(){
        this.setState({background: !this.state.background})
    }

    toggleBackgroundColor(){
        this.setState({value: !this.state.value});
            if(!this.state.value){
                document.body.classList.remove('theme--dark');
                document.body.classList.add('theme--light');
                this.setState({bc: "Toggle Dark Background"});
                console.log("light chosen");
            } else {
                document.body.classList.add('theme--dark');
                document.body.classList.remove('theme--light');
                this.setState({bc: "Toggle Light Background"});
            }
    }

    render() {
        return(
            <div className="nav">					
                <Dropdown nav isOpen={this.state.file} toggle={this.toggleFile.bind(this)}>
                    <DropdownToggle nav className="menuItem"> 
                        File 
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => EditorDispatcher.emptyFile()}>New File</DropdownItem>
                        <DropdownItem onClick={() => SelectFileFolder.selectFile()}>Open File</DropdownItem>
                        <DropdownItem onClick={() => SelectFileFolder.selectFolder()}>Open Folder</DropdownItem>
                        <RecentFiles/>
                        <DropdownItem onClick={() => ModalDispatcher.saveFileAsModal()}>Save As</DropdownItem>
                        <DropdownItem onClick={() => EditorDispatcher.saveCurrentFile()}>Save</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => EditorDispatcher.runCode()}>Run</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => IpcRequester.quit()}>Exit</DropdownItem>
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
                        <Dropdown nav isOpen={this.state.appearance} toggle={this.toggleAppearance.bind(this)}>
                             <DropdownToggle nav className="menuItem">Appearance <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon></DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem>Toggle GHCI Console</DropdownItem>
                                    <DropdownItem>Toggle File List</DropdownItem>
                                    <DropdownItem onClick={this.toggleBackgroundColor.bind(this)}>{this.state.bc}</DropdownItem>
                                </DropdownMenu>
                        </Dropdown>
                        <DropdownItem>Editor Layout</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    }
}

