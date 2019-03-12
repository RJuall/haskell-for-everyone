import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/pro-light-svg-icons"
import FolderDispatcher from "../dispatchers/FolderDispatcher";
import FileDispatcher from "../dispatchers/FileDispatcher";
import ModalDispatcher from "../dispatchers/ModalDispatcher";
import { FILE_EXTENSIONS } from "../utils/FileExtension";

export class FileListFolder extends React.Component{

    constructor(props){
        super(props);
        this.toggleActiveClass= this.toggleActiveClass.bind(this);
        this.state = {
            active: false,
        };
    }

    toggleActiveClass() {
        const currentState = this.state.active;
        this.setState({ active: !currentState });
    };

    renderFileItem(fname){
        return (
            <div key={fname} onClick={() => this.toggleActiveClass} className={this.state.active ? 'active': null}>
               <span className="file-list-item" key={fname} onClick={() => FileDispatcher.readFile(`${this.props.folderPath}/${fname}`)}>
                    {fname}
                    <br/>
                </span>
            </div>
        );
    }

    render(){
        // prop values
        let {folderPath, fileNames} = this.props;

        // array of all file names ending with valid extensions
        let fnames = fileNames.filter(fname => "." + fname.split(".").pop() in FILE_EXTENSIONS);

        // return an array of elements 
        let fileElements = fnames.map(fname => this.renderFileItem(fname));

        // folder name is at the end (current naming convention will have no '/' at the end)
        let folderName = folderPath.split("/").pop();

        return (
            <div className="file-list-folder-container" key={folderPath}>
                <div className="file-list-folder" title={folderPath}>
                    <span onClick={() => FolderDispatcher.removeFolder(folderPath)}>
                        <FontAwesomeIcon icon={faMinusCircle} style={{color: "red", cursor: "pointer"}}/>
                    </span>
                    &nbsp;
                    {folderName}
                    &nbsp;
                    <span onClick={() => ModalDispatcher.createFileModal(folderPath)}>
                        <FontAwesomeIcon icon={faPlusCircle} style={{color: "green", cursor: "pointer"}}/>
                    </span>
                </div>
                <div className="file-list-items">
                    {fileElements}
                </div>
            </div>
        );
    }
}