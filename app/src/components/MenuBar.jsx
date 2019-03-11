import React from 'react';
import ModalDispatcher from '../dispatchers/ModalDispatcher';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Navbar as RNavbar, NavItem, Collapse, NavbarToggler, Nav, NavLink } from "reactstrap";
import { NavbarBrand } from 'reactstrap';
import './MenuBar.css';

export class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: true
        };
    }

    render() {
        return(
            <div class="nav">
                <RNavbar>
                    <NavbarBrand></NavbarBrand>
                        <Collapse isOpen={this.state.showMenu} navbar>					
                            <Nav navbar  className="ml-auto navbar-expand-lg">
                                <NavItem>
                                    <NavLink className="pointer" selected> File </NavLink>
                                </NavItem>
                                &nbsp;&nbsp;
                                <NavItem>
                                    <NavLink  className="pointer" selected> Edit </NavLink>
                                </NavItem>
                                &nbsp;&nbsp;
                                <NavItem>
                                    <NavLink className="pointer" selected> Preferences </NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                </RNavbar>
            </div>
        );
    }
}
