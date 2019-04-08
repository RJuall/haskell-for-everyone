import React from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { inject, observer } from 'mobx-react';
import castle from '../images/castle.gif';

export const ModalEasterEgg = inject('windowStore')(observer(class ModalEasterEgg extends React.Component {
    constructor(props) {
        super(props);
    }

    toggle = () => {
        Object.assign(
            this.props.windowStore.sessionWindowStore, 
            { modalEasterEggOpen: !this.props.windowStore.sessionWindowStore.modalEasterEggOpen }
        );
    }

    render() {
        return(
            <Modal isOpen={this.props.windowStore.sessionWindowStore.modalEasterEggOpen} toggle={this.toggle.bind(this)}>
                <ModalHeader toggle={this.toggle.bind(this)}>
                    <h1>Haskell For Everyone</h1>
                </ModalHeader>
                <ModalBody>
                    <p>Built by David Rosenblum, Robert Juall, JT Pojero, Rajib Bastola</p>
                    <p>For Dr. Barry Burd's Functional Programming course</p>
                    <p>as part of the Computer Science capstone at Drew University</p>
                    <img src={castle}></img>
                </ModalBody>
            </Modal>
        );
    }
}));