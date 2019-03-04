import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText, Button} from "reactstrap";
import ModalDispatcher, { CREATE_FILE_MODAL, SAVE_FILE_AS_MODAL} from "../dispatchers/ModalDispatcher";
import FileDispatcher from "../dispatchers/FileDispatcher";

export class ModalCreateFile extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isOpen: false,          // visible?
            dir: null               // forced filename
        };

        this.dirInput = null;       // directory input element
        this.fnameInput = null;     // file name input element
    }

    toggle(){
        this.setState({isOpen: !this.state.isOpen});
    }

    // handle modal start event
    // show the modal and optionally have forced directory 
    handleFileCreate = evt => {
        let dir = evt.dir || "";
        this.setState({isOpen: true, dir});
    };

    onSubmit(evt){
        // prevent app refresh
        evt.preventDefault();

        // get input values
        let fname = this.fnameInput.value,
            dir = this.dirInput.value;

        // get file name with correct extension
        // user could accidentally type .hs
        let fileName = fname.endsWith(".hs") ? fname : `${fname}.hs`;

        // signal fire creation
        FileDispatcher.createFile(fileName, dir);

        // close modal
        this.setState({isOpen: false});
    }

    componentDidMount(){
        // listen for create file modal signals
        ModalDispatcher.on(CREATE_FILE_MODAL, this.handleFileCreate);
    }

    componentWillUnmount(){
        // stop listening for create file modal signals
        ModalDispatcher.removeListener(CREATE_FILE_MODAL, this.handleFileCreate);

        // stop listening for create file modal signals
        ModalDispatcher.removeListener(SAVE_FILE_AS_MODAL, this.handleFileSaveAs);
    }

    render(){
        return (
            <Modal isOpen={this.state.isOpen} toggle={this.toggle.bind(this)}>
                <ModalHeader toggle={this.toggle.bind(this)}>
                    Create File
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.onSubmit.bind(this)}>
                        <FormGroup>
                            <Label>Directory</Label>
                            <Input
                                innerRef={elem => this.dirInput = elem}
                                defaultValue={this.state.dir}
                                disabled={(this.state.dir && this.state.dir.length)}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>File Name</Label>
                            <InputGroup>
                                <Input
                                    innerRef={elem => this.fnameInput = elem}
                                    required
                                />
                                <InputGroupAddon addonType="append">
                                    <InputGroupText>.hs</InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </FormGroup>
                        <div>
                            <Button>Create</Button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal>
        );
    }
}