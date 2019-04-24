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
import { VERSION } from './App';


export const MenuBar = inject("editorStore","windowStore")(observer (class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: false,
            edit: false,
            preference: false,
            about: false,
            background: false,
            hideGHCI: false, // state for whether the GHCI console is shown or not
            hideFile: false, // state for whether the file list is shown or not
            showSearch: false,
            toggleTheme: false,
            theme: this.props.editorStore.editorSettings.theme
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

    toggleAbout(){
        this.setState({about: !this.state.about});
    }

    toggleTheme(){
        this.setState({toggleTheme: !this.state.toggleTheme})
    }

    //Chnage the background color of window between light and dark
    toggleBackgroundColor(){
        if(this.props.windowStore.windowSettings.theme === "dark"){
            this.props.windowStore.windowSettings.theme = "light";
        } else {
            this.props.windowStore.windowSettings.theme = "dark";
        }
    }

    // Hide/Show the GHCI terminal column
    toggleGhciConsole(){
        this.setState({hideGHCI: !this.state.hideGHCI});
        if(!this.state.hideGHCI){
            Object.assign(this.props.windowStore.windowSettings,{hideGHCI: true});
            //console.log("Hide Console");
        }else{
            Object.assign(this.props.windowStore.windowSettings,{hideGHCI: false});
            //console.log("Show Console");
        }
    }

    // Hide/Show the file list Column
    toggleFileList(){
        this.setState({hideFile: !this.state.hideFile});
        if(!this.state.hideFile){
            Object.assign(this.props.windowStore.windowSettings,{hideFile: true});
            //console.log("Hide File List");
        }else{
            Object.assign(this.props.windowStore.windowSettings,{hideFile: false});
            //console.log("Show File List");
        }
        //console.log(this.props.windowStore.windowSettings.hideFile);
    }

    toggleSearchBar(){
        //If true then show the searchbar, else if false then hide the search bar
        console.log("Called search bar");
        Object.assign(this.props.windowStore.windowSettings,{showSearch: true});
    }

    selectTheme(theme){
        console.log(theme.target.value);
        this.props.editorStore.editorSettings.theme = theme.target.value;
        if(this.props.editorStore.editorSettings.theme === "github" || this.props.editorStore.editorSettings.theme === "Tomorrow" || 
            this.props.editorStore.editorSettings.theme === "kuroir" || this.props.editorStore.editorSettings.theme === "xcode" ||
            this.props.editorStore.editorSettings.theme === "textmate" || this.props.editorStore.editorSettings.theme === "solarized_light" ||
            this.props.editorStore.editorSettings.theme === "eclipse"){
            Object.assign(this.props.windowStore.windowSettings,{theme : "light"});
        }else{
            Object.assign(this.props.windowStore.windowSettings,{theme : "dark"});
        }
    }

    render() {
        let toggleBgColor = `Toggle ${this.props.windowStore.windowSettings.theme === "dark" ? "Light" : "Dark"} Background`;

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
                        <DropdownItem divider />
                        <DropdownItem onClick={() => this.toggleSearchBar()}>Find</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => EditorDispatcher.Redo()}>Redo</DropdownItem>
                        <DropdownItem onClick={() => EditorDispatcher.Undo()}>Undo</DropdownItem>
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
                        <DropdownItem divider />
                        <Dropdown nav isOpen={this.state.toggleTheme} toggle={this.toggleTheme.bind(this)}>
                            <DropdownToggle nav className="menuItem"> 
                                Editor Theme 
                            </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={this.selectTheme.bind(this)} value="dracula">Dracula</DropdownItem>
                                    <DropdownItem onClick={this.selectTheme.bind(this)} value="github">Github</DropdownItem>
                                    <DropdownItem onClick={this.selectTheme.bind(this)} value="tomorrow">Tomorrow</DropdownItem>
                                    <DropdownItem onClick={this.selectTheme.bind(this)} value="kuroir">Kuroir</DropdownItem>
                                    <DropdownItem onClick={this.selectTheme.bind(this)} value="twilight">Twilight</DropdownItem>
                                    <DropdownItem onClick={this.selectTheme.bind(this)} value="xcode">Xcode</DropdownItem>
                                    <DropdownItem onClick={this.selectTheme.bind(this)} value="textmate">TextMate</DropdownItem>
                                    <DropdownItem onClick={this.selectTheme.bind(this)} value="solarized_dark">Solarized Dark</DropdownItem>
                                    <DropdownItem onClick={this.selectTheme.bind(this)} value="solarized_light">Solarized Light</DropdownItem>
                                    <DropdownItem onClick={this.selectTheme.bind(this)} value="terminal">Terminal</DropdownItem>
                                    <DropdownItem onClick={this.selectTheme.bind(this)} value="monokai">Monokai</DropdownItem>
                                    <DropdownItem onClick={this.selectTheme.bind(this)} value="eclipse">Eclipse</DropdownItem>
                                </DropdownMenu>
                        </Dropdown>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown nav isOpen={this.state.about} toggle={this.toggleAbout.bind(this)}>
                    <DropdownToggle nav className="menuItem">
                        About
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header>
                            Version {VERSION}
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    }
}));

