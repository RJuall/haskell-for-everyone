import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText, Button} from "reactstrap";
import ModalDispatcher, { SAVE_FILE_AS_MODAL } from "../dispatchers/ModalDispatcher";
import EditorDispatcher from "../dispatchers/EditorDispatcher";

export const LOCAL_FOLDER = "app_hs";

export class ModalSaveFileAs extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isOpen: false,          // visible?
            dir:    null,           // forced folder
            dirSel: null            // selected folder (used when picking)
        };

        this.dirInput = null;       // directory input element
        this.fnameInput = null;     // file name input element
    }

    toggle(){
        this.setState({isOpen: !this.state.isOpen});
    }

    // shows the modal for file save as 
    handleFileSaveAs = () => {
        let dir = null; //LOCAL_FOLDER;
        this.setState({isOpen: true, dir});
    }

    onSubmit(evt){
        // prevent app refresh
        evt.preventDefault();

        // get input values
        let fname = this.fnameInput.value,
            dir = this.dirInput.files[0].path.replace(/(\\)/g, "/");

        // get file name with correct extension
        // user could accidentally type .hs
        let fileName = fname.endsWith(".hs") ? fname : `${fname}.hs`;
        let path = `${dir}/${fileName}`;

        // create file with edtior's text
        EditorDispatcher.saveAs(path);

        // close and reset modal
        this.setState({isOpen: false, dirSel: null});
    }

    componentDidMount(){
         // listen for save file as modal signals
         ModalDispatcher.on(SAVE_FILE_AS_MODAL, this.handleFileSaveAs);
    }

    componentWillUnmount(){
        // stop listening for create file modal signals
        ModalDispatcher.removeListener(SAVE_FILE_AS_MODAL, this.handleFileSaveAs);
    }

    renderDirFolderInput(){
        return (
            <Input
                innerRef={elem => this.dirInput = elem}
                onChange={() => this.setState({dirSel: this.dirInput.files[0].path})}
                type="file"
                webkitdirectory={LOCAL_FOLDER}
                required
                hidden={true}
            />
        );
    }

    renderDirInput(){
        // dynamic directory with something selected (dirSel = selected directory by user)
        if(this.state.dirSel){
            return (
                <>  
                <br/>
                <div>
                    <Input value={this.state.dirSel} disabled={true} name={null}/>
                </div>
                <br/>
                <div>
                    <Button type="button" onClick={() => this.dirInput.click()}>Change</Button>
                </div>
                </>
            );
        }

        // dynamic directory with nothing selected
        return (
            <>
            <br/>
            <Button type="button" onClick={() => this.dirInput.click()}>Select</Button>
            </>
        );
    }

    render(){
        return (
            <Modal isOpen={this.state.isOpen} toggle={this.toggle.bind(this)}>
                <ModalHeader toggle={this.toggle.bind(this)}>
                    Save As
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.onSubmit.bind(this)}>
                        <FormGroup>
                            <Label>Directory</Label>
                            {this.renderDirInput()}
                            {this.renderDirFolderInput()}
                        </FormGroup>
                        <FormGroup>
                            <Label>File Name</Label>
                            <InputGroup>
                                <Input
                                    innerRef={elem => this.fnameInput = elem}
                                    disabled={!this.state.dir && !this.state.dirSel}
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