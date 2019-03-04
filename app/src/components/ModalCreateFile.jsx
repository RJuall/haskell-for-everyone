import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText, Button} from "reactstrap";
import ModalDispatcher, { CREATE_FILE_MODAL, SAVE_FILE_AS_MODAL } from "../dispatchers/ModalDispatcher";
import FileDispatcher from "../dispatchers/FileDispatcher";

export const LOCAL_FOLDER = "app_hs";

export class ModalCreateFile extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isOpen: false,          // visible?
            dir:    null,           // forced filename
            title:  null            // title (default= Create File)
        };

        this.dirInput = null;       // directory input element
        this.fnameInput = null;     // file name input element
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

    // shows the modal for file save as 
    handleFileSaveAs = () => {
        let dir = null; //LOCAL_FOLDER;
        this.setState({isOpen: true, dir, title: "Save As"});
    }

    onSubmit(evt){
        // prevent app refresh
        evt.preventDefault();

        // get input values
        let fname = this.fnameInput.value,
            dir = this.dirInput.value;

        // creating a file in a custom location
        // use the path of the selection location 
        if(this.dirInput.type === "file"){
            dir = this.dirInput.files[0].path.replace(/(\\)/g, "/");
        }

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

         // listen for save file as modal signals
         ModalDispatcher.on(SAVE_FILE_AS_MODAL, this.handleFileSaveAs);
    }

    componentWillUnmount(){
        // stop listening for create file modal signals
        ModalDispatcher.removeListener(CREATE_FILE_MODAL, this.handleFileCreate);

        // stop listening for create file modal signals
        ModalDispatcher.removeListener(SAVE_FILE_AS_MODAL, this.handleFileSaveAs);
    }

    renderDirInput(){
        // fixed directory 
        if(this.state.dir){
            return (
                <Input
                    innerRef={elem => this.dirInput = elem}
                    type="text"
                    defaultValue={this.state.dir}
                    disabled={(this.state.dir && this.state.dir.length)}
                    required
                />
            )
        }

        // dynamic directory 
        return (
            <Input
                innerRef={elem => this.dirInput = elem}
                type="file"
                webkitdirectory="./app_hs"
                required
            />
        )
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
                            {this.renderDirInput()}
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