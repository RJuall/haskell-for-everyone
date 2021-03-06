import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText, Button} from "reactstrap";
import ModalDispatcher, { CREATE_FILE_MODAL } from "../dispatchers/ModalDispatcher";
import FileDispatcher, { FILE_CREATE } from "../dispatchers/FileDispatcher"
import { FileExtension } from "../utils/FileExtension";

export class ModalCreateFile extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isOpen: false,          // visible?
            dir:    null            // forced directory 
        };

        this.dirInput = null;       // directory input element
        this.fnameInput = null;     // file name input element
        this.extInput = null;       // file extension input element
    }

    toggle(){
        this.setState({isOpen: !this.state.isOpen});
    }

    // shows the modal for file creation
    // show the modal and optionally have forced directory 
    handleFileCreate = evt => {
        let dir = evt.dir || "";
        this.setState({isOpen: true, dir, title: null});
    }

    // invoked when a file is created
    handleFileCreated = evt => {
        // auto open the newly created file 
        if(!evt.err){
            FileDispatcher.readFile(`${evt.dir}/${evt.fileName}`);
        }
    }

    onSubmit(evt){
        // prevent app refresh
        evt.preventDefault();

        // get input values
        let fname = this.fnameInput.value,  // raw file name
            dir = this.dirInput.value,      // raw directory (likely preset/fixed)
            ext = this.extInput.value;      // selected extension 

        // user is typing an extension, try it 
        // ternary prevents something like... file.hs.hs 
        let fileName = fname.includes(".") ? fname : (fname + ext);

        // valide extension (if bad extension makes it .hs)
        fileName = FileExtension.validateFileName(fileName);

        // setup path
        let path = `${dir}/${fileName}`;

        // signal new file creation
        FileDispatcher.createFile(path);

        // close and reset modal
        this.setState({isOpen: false});
    }

    componentDidMount(){
        // listen for create file modal signals
        ModalDispatcher.on(CREATE_FILE_MODAL, this.handleFileCreate);
        // listen for file creation 
        FileDispatcher.on(FILE_CREATE, this.handleFileCreated);
    }

    componentWillUnmount(){
        // stop listening for create file modal signals
        ModalDispatcher.removeListener(CREATE_FILE_MODAL, this.handleFileCreate);
        // stop listening for file creation
        FileDispatcher.removeListener(FILE_CREATE, this.handleFileCreated);
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
                                type="text"
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
                                    <Input innerRef={elem => this.extInput = elem} type="select">
                                        {FileExtension.list().map(ext => <option key={ext}>{ext}</option>)}
                                    </Input>
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