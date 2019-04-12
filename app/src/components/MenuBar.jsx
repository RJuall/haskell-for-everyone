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
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';


export const MenuBar = inject("windowStore")(observer (class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: false,
            edit: false,
            preference: false,
            background: false,
            online:     false,
            value: false,   //True = Light  False = Dark
            hideGHCI: false, // state for whether the GHCI console is shown or not
            hideFile: false // state for whether the file list is shown or not
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

    // Toggle Dropdown for background color
    toggleBackground(){
        this.setState({background: !this.state.background})
    }

    // toggles online dropdown menu 
    toggleOnline(){
        this.setState({online: !this.state.online});
    }

    toggleBackgroundColor(){
        this.setState({value: !this.state.value});
        if(!this.state.value){
            document.body.classList.remove('theme--dark');
            document.body.classList.add('theme--light');
            
            Object.assign(this.props.windowStore.windowSettings,{theme: "light"});
            console.log(this.props.windowStore.windowSettings.theme);
        } else {
            document.body.classList.add('theme--dark');
            document.body.classList.remove('theme--light');
        
            Object.assign(this.props.windowStore.windowSettings,{theme: "dark"});
            console.log(this.props.windowStore.windowSettings.theme);

        }

        // switch text so its like Toggle (Light/dark) background
        this.props.windowStore.updateThemeText();
    }

    toggleGhciConsole(){
        this.setState({hideGHCI: !this.state.hideGHCI});
        if(!this.state.hideGHCI){
            console.log("Hide Console");
        }else{
            console.log("Show Console");
        }
    }

    toggleFileList(){
        this.setState({hideGHCI: !this.state.hideFile});
        if(!this.state.hideFile){
            console.log("Show File List");
        }else{
            console.log("Hide File List");
        }
    }

    render() {
        let toggleBgColor = this.props.windowStore.windowSettings.themeText;

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
                        {/* <DropdownItem>Find</DropdownItem> */}
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
                        <DropdownItem onClick={this.toggleGhciConsole.bind(this)}>Toggle GHCI Console</DropdownItem>
                        <DropdownItem onClick={this.toggleFileList.bind(this)}>Toggle File List</DropdownItem>
                        <DropdownItem onClick={this.toggleBackgroundColor.bind(this)}>{toggleBgColor}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                {/*<Dropdown nav isOpen={this.state.online} toggle={this.toggleOnline.bind(this)}>
                    <DropdownToggle nav className="menuItem">
                        Online
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => ModalDispatcher.joinRoomModal()}>
                            Join Room
                        </DropdownItem>
                        <DropdownItem onClick={() => ModalDispatcher.createRoomModal()}>
                            Create Room
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>*/}
            </div>
        );
    }
}));

