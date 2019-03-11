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
            showMenu: true,
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
            <div class="nav">
                <RNavbar>
                    <NavbarBrand></NavbarBrand>
                        <Collapse isOpen={this.state.showMenu} navbar>					
                            <Nav navbar  className="ml-auto navbar-expand-lg h-25">
                                <Dropdown nav isOpen={this.state.file} toggle={this.toggleFile.bind(this)}>
                                    <DropdownToggle nav className="menuItem"> 
                                        File 
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>New File</DropdownItem>
                                        <DropdownItem>Open</DropdownItem>
                                        <DropdownItem onClick={() => ModalDispatcher.saveFileAsModal()}>Save As</DropdownItem>
                                        <DropdownItem onClick={() => EditorDispatcher.saveCurrentFile()}>Save</DropdownItem>
                                        <DropdownItem>Select Workspace</DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem onClick={() => EditorDispatcher.runCode()}>run</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                &nbsp;&nbsp;
                                <Dropdown nav isOpen={this.state.edit} toggle={this.toggleEdit.bind(this)}>
                                    <DropdownToggle nav className="menuItem"> 
                                        Edit 
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Paste</DropdownItem>
                                        <DropdownItem>Copy</DropdownItem>
                                        <DropdownItem>Cut</DropdownItem>
                                        <DropdownItem>Find</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                &nbsp;&nbsp;
                                <Dropdown nav isOpen={this.state.preference} toggle={this.togglePreferences.bind(this)}>
                                    <DropdownToggle nav className="menuItem"> 
                                        Preferences 
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Appearance</DropdownItem>
                                        <DropdownItem>Editor Layout</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Nav>
                        </Collapse>
                </RNavbar>
            </div>
        );
    }
}