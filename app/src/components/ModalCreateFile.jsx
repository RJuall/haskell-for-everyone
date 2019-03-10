import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText, Button} from "reactstrap";
import ModalDispatcher, { CREATE_FILE_MODAL } from "../dispatchers/ModalDispatcher";
import FileDispatcher from "../dispatchers/FileDispatcher";

// allowed to create/view file formats  
export const FILE_EXTENSIONS = {
    ".hs": true,
    ".md": true
};

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

    // makes sure a file name has a valid extension (such as .hs)
    // puts '.hs' at end of file if it does not
    // @param fname     raw file name
    checkFileName(fname){
        for(let ext in FILE_EXTENSIONS){
            if(fname.endsWith(ext)){
                return fname;
            }
        }
        return `${fname}.hs`; // due to dropdown this should never happen 
    }

    // shows the modal for file creation
    // show the modal and optionally have forced directory 
    handleFileCreate = evt => {
        let dir = evt.dir || "";
        this.setState({isOpen: true, dir, title: null});
    }

    onSubmit(evt){
        // prevent app refresh
        evt.preventDefault();

        // get input values
        let fname = this.fnameInput.value,  // raw file name
            dir = this.dirInput.value,      // raw directory (likely preset)
            ext = this.extInput.value;      // selected extension 

        // get file name with correct extension
        // user could accidentally type .hs
        // ternary prevents something like... file.hs.hs 
        let fileName = this.checkFileName(fname.endsWith(ext) ? fname : (fname + ext));

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
    }

    componentWillUnmount(){
        // stop listening for create file modal signals
        ModalDispatcher.removeListener(CREATE_FILE_MODAL, this.handleFileCreate);
    }

    render(){
        return (
            <Modal isOpen={this.state.isOpen} toggle={this.toggle.bind(this)}>
                <ModalHeader toggle={this.toggle.bind(this)}>
                    {this.state.title || "Create File"}
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
                                        {Object.keys(FILE_EXTENSIONS).map(ext => <option>{ext}</option>)}
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