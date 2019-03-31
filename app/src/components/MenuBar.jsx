import React from 'react';
import ModalDispatcher from '../dispatchers/ModalDispatcher';
import EditorDispatcher from '../dispatchers/EditorDispatcher';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import './MenuBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/pro-regular-svg-icons';
import { SelectFileFolder } from '../utils/SelectFileFolder';


export class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: false,
            edit: false,
            preference: false,
            appearance: false,
            background: false
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

    render() {
        return(
            <div className="nav">					
                <Dropdown nav isOpen={this.state.file} toggle={this.toggleFile.bind(this)}>
                    <DropdownToggle nav className="menuItem"> 
                        File 
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => ModalDispatcher.createFileModal()}>New File</DropdownItem>
                        <DropdownItem onClick={() => SelectFileFolder.selectFile()}>Open File</DropdownItem>
                        <DropdownItem onClick={() => SelectFileFolder.selectFolder()}>Open Folder</DropdownItem>
                        <DropdownItem onClick={() => ModalDispatcher.saveFileAsModal()}>Save As</DropdownItem>
                        <DropdownItem onClick={() => EditorDispatcher.saveCurrentFile()}>Save</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => EditorDispatcher.runCode()}>Run</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Exit</DropdownItem>
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
                                    <Dropdown nav isOpen={this.state.background} toggle={this.toggleBackground.bind(this)}>
                                        <DropdownToggle nav className="menuItem">Background Theme <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon></DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem>Light</DropdownItem>
                                                <DropdownItem>Dark</DropdownItem>
                                            </DropdownMenu>
                                    </Dropdown>
                                </DropdownMenu>
                        </Dropdown>
                        <DropdownItem>Editor Layout</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    }
}
