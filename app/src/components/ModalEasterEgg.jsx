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
            <Modal 
                isOpen={this.props.windowStore.sessionWindowStore.modalEasterEggOpen} 
                toggle={this.toggle.bind(this)}
                style={{  
                     textAlign: 'center',
                }}
            >
                <ModalHeader style={{border: 'none', padding: '1em', margin: '0'}} toggle={this.toggle.bind(this)}>
                </ModalHeader>
                <ModalBody>
                    <h1 style={{paddingBottom: '0.85em'}}>
                        OBLIGATORY<br/>EASTER EGG
                    </h1>
                    <img
                        width="90%" 
                        src={castle}>
                    </img>
                    <p style={{fontSize: '0.85em', paddingTop: '1em'}}>
                        &copy; Konami
                    </p>
                </ModalBody>
                <ModalFooter style={{border: 'none'}}>
                    <p style={{fontSize: '0.85em', padding: '0', margin: '0'}}>
                        Thanks for trying our app!   --RJ, DR, JT, RB
                    </p>
                </ModalFooter>
            </Modal>
        );
    }
}));