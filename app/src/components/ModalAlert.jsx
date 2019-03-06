import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ModalDispatcher, { ALERT_MODAL } from "../dispatchers/ModalDispatcher";

export class ModalAlert extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isOpen: false,      // open or closed modal
            header: null,       // header text
            body:   null,       // body text
            footer: null        // footer text
        };
    }

    toggle(){
        this.setState({isOpen: !this.state.isOpen});
    }

    handleModalAlert = evt => {
        let {header=null, body=null, footer=null} = evt;
        this.setState({isOpen: true, header, body, footer});
    }

    componentDidMount(){
        ModalDispatcher.on(ALERT_MODAL, this.handleModalAlert);
    }

    componentWillUnmount(){
        ModalDispatcher.removeListener(ALERT_MODAL, this.handleModalAlert);
    }

    render(){
        return (
            <Modal isOpen={this.state.isOpen} toggle={this.toggle.bind(this)}>
                <ModalHeader toggle={this.toggle.bind(this)}>
                    {this.state.header}
                </ModalHeader>
                <ModalBody>
                    {this.state.body}
                </ModalBody>
                <ModalFooter>
                    {this.state.footer}
                </ModalFooter>
            </Modal>
        )
    }
}