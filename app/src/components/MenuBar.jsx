import React from 'react';
import ModalDispatcher from '../dispatchers/ModalDispatcher';
import EditorDispatcher from '../dispatchers/EditorDispatcher';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Navbar as RNavbar, NavItem, Collapse, NavbarToggler, Nav, NavLink } from "reactstrap";
import { NavbarBrand } from 'reactstrap';
import './MenuBar.css';

export class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            file: false,
            edit: false,
            preference: false
        };
    }

    toggleFile(){
        this.setState({file: !this.state.file});
    }

    toggleEdit(){
        this.setState({edit: !this.state.edit});
    }

    togglePreferences(){
        this.setState({preference: !this.state.preference});
    }

    render() {
        return(
            <div className="nav">
                <Dropdown nav isOpen={this.state.file} toggle={this.toggleFile.bind(this)}>
                    <DropdownToggle nav className="menuItem"> 
                        File 
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>New File</DropdownItem>
                        <DropdownItem onClick={() => ModalDispatcher.selectFileModal()}>Open File</DropdownItem>
                        <DropdownItem onClick={() => ModalDispatcher.selectFolderModal()}>Open Folder</DropdownItem>
                        <DropdownItem onClick={() => ModalDispatcher.saveFileAsModal()}>Save As</DropdownItem>
                        <DropdownItem onClick={() => EditorDispatcher.saveCurrentFile()}>Save</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => EditorDispatcher.runCode()}>Run</DropdownItem>
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
                <Dropdown nav isOpen={this.state.edit} toggle={this.toggleEdit.bind(this)}>
                    <DropdownToggle nav className="menuItem"> 
                        Edit 
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => document.execCommand("paste")}>Paste</DropdownItem>
                        <DropdownItem onClick={() => document.execCommand("copy")}>Copy</DropdownItem>
                        <DropdownItem onClick={() => document.execCommand("cut")}>Cut</DropdownItem>
                        <DropdownItem>Find</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    }
}
