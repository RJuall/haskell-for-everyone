import React from "react";
import { Input } from "reactstrap";
import ModalDispatcher, { SELECT_FILE_MODAL, SELECT_FOLDER_MODAL, FILE_SELECTED, FOLDER_SELECTED } from "../dispatchers/ModalDispatcher";
import FolderDispatcher from "../dispatchers/FolderDispatcher";
import { FILE_EXTENSIONS, FileExtension } from "../utils/FileExtension";

export class ModalSelectFile extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            fileNotFolder: true     // file or folder mode
        };

        this.filePathInput = null;  // selected file path 
    }

    componentDidMount(){
        // slisten for select file modal signals
        ModalDispatcher.on(SELECT_FILE_MODAL, this.handleSelectFile);

        // listen for select fiolder modal signals
        ModalDispatcher.on(SELECT_FOLDER_MODAL, this.handleSelectFolder);
    }

    handleSelectFile = evt => {
        this.setState({fileNotFolder: true}, () => {
            this.filePathInput.click();
        });
    }

    handleSelectFolder = evt => {
        this.setState({fileNotFolder: false}, () => {
            this.filePathInput.click();
        });        
    }

    componentWillUnmount(){
        // stop listening for select file modal signals
        ModalDispatcher.removeListener(SELECT_FILE_MODAL, this.handleSelectFile);

        // stop listening for select fiolder modal signals
        ModalDispatcher.removeListener(SELECT_FOLDER_MODAL, this.handleSelectFolder);
    }


    onSelection = () => {
        // selected path
        let path = this.filePathInput.files[0].path.replace(/(\\)/g, "/");
        path = path.endsWith("/") ? path.substring(0, path.length-1) : path;
        
        if(this.state.fileNotFolder){
            let split = path.split("/");
            split.pop();

            FolderDispatcher.addFolder(split.join("/"));
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