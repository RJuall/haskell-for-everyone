import React from "react";
import { Input } from "reactstrap";
import ModalDispatcher, { SELECT_FILE_MODAL, SELECT_FOLDER_MODAL } from "../dispatchers/ModalDispatcher";
import FolderDispatcher from "../dispatchers/FolderDispatcher";
import { FileExtension } from "../utils/FileExtension";
import FileDispatcher from "../dispatchers/FileDispatcher";

export class ModalSelectFile extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            fileNotFolder: true     // file or folder mode
        };

        this.filePathInput = null;  // selected file path 
    }

    // forces the secret input element to be clicked
    forceSelectDialog(){
        if(this.filePathInput){
            this.filePathInput.click();
        }
        else{
            // if it doesn't exist - force render then click 
            this.forceUpdate(() => {
                this.filePathInput.click();
            });
        }
    }

    // select file modal triggered
    handleSelectFile = evt => {
        this.setState({fileNotFolder: true}, () => {
            this.forceSelectDialog();
        });
    }

    // select folder modal triggered
    handleSelectFolder = evt => {
        this.setState({fileNotFolder: false}, () => {
            this.forceSelectDialog();
        });
    }

    componentDidMount(){
        // slisten for select file modal signals
        ModalDispatcher.on(SELECT_FILE_MODAL, this.handleSelectFile);

        // listen for select fiolder modal signals
        ModalDispatcher.on(SELECT_FOLDER_MODAL, this.handleSelectFolder);
    }

    componentWillUnmount(){
        // stop listening for select file modal signals
        ModalDispatcher.removeListener(SELECT_FILE_MODAL, this.handleSelectFile);

        // stop listening for select fiolder modal signals
        ModalDispatcher.removeListener(SELECT_FOLDER_MODAL, this.handleSelectFolder);
    }


    onSelection = () => {
        // nothing selected (cancel button clicked)
        if(!this.filePathInput.files.length) return;

        // selected path
        let path = this.filePathInput.files[0].path.replace(/(\\)/g, "/");
        path = path.endsWith("/") ? path.substring(0, path.length-1) : path;

        if(this.state.fileNotFolder){
            // remove file name (dir path)
            let split = path.split("/");
            split.pop();

            FolderDispatcher.addFolder(split.join("/"));
            FileDispatcher.readFile(path);
        }
        else{
            FolderDispatcher.addFolder(path);
        }
    }

    render(){
        if(this.state.fileNotFolder){
            return (
                <Input
                    innerRef={elem => this.filePathInput = elem}
                    type="file"
                    hidden={true}
                    accept={FileExtension.list().join(",")}
                    onChange={this.onSelection}
                />
            )
        }

        return (
            <Input
                innerRef={elem => this.filePathInput = elem}
                type="file"
                hidden={true}
                webkitdirectory="/"
                onChange={this.onSelection}
            />
        )
    }
}