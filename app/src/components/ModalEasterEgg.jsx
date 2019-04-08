import React from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { inject, observer } from 'mobx-react';

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
                </ModalHeader>
                <ModalBody>
                    <h1>TEST</h1>
                </ModalBody>
            </Modal>
        );
    }
}));