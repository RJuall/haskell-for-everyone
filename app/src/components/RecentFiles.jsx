import React from "react";
import { Dropdown, DropdownToggle, DropdownItem, DropdownMenu } from "reactstrap";
import { observer, inject } from 'mobx-react';
import FileDispatcher from "../dispatchers/FileDispatcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/pro-regular-svg-icons";

export const RecentFiles = inject("fileStore")(observer(class RecentFiles extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            isOpen: false
        };
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    render(){
        let {recentFilePaths=[]} = this.props.fileStore.fileSettings;

        let items = recentFilePaths.map(path => {
            return (
                <DropdownItem key={path} onClick={() => FileDispatcher.readFile(path)}>
                    {path}
                </DropdownItem>
            );
        });

        return (
            <Dropdown nav isOpen={this.state.isOpen} toggle={this.toggle}>
                <DropdownToggle nav className="menuItem">
                    Recent Files <FontAwesomeIcon icon={faAngleRight}/>
                </DropdownToggle>
                <DropdownMenu>
                    {items}
                </DropdownMenu>
            </Dropdown>
        )
    }
}));