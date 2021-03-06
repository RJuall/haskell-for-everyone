import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleDown, faFolder, faFolderOpen } from "@fortawesome/pro-light-svg-icons"
import { FileListFolderItem } from "./FileListFolderItem";
import { FILE_EXTENSIONS } from "../utils/FileExtension";


export class FileListFolder extends React.Component{

    constructor(props){
        super(props);
        
        this.state = {
            active:     false,  // css active state
            collapsed:  false   // collapsed? 
        };
    }

    toggleCollapse = evt => {
         // don't collapse when new file is clicked 
         if(!evt.target.parentNode || !evt.target.parentNode.getAttribute("data-no-collapse")){
            this.setState({collapsed: !this.state.collapsed});
        }
    }

    render(){
        // prop values
        let {folderPath, fileNames} = this.props;

        // array of all file names ending with valid extensions
        let fnames = fileNames.filter(fname => "." + fname.split(".").pop() in FILE_EXTENSIONS);

        // return an array of elements 
        let fileElements = this.state.collapsed ? null : fnames.map(fname => {
            return (
                <FileListFolderItem
                    key={fname}
                    fileName={fname}
                    folderPath={folderPath}
                />
            );
        });

        // folder name is at the end (current naming convention will have no '/' at the end)
        let folderName = folderPath.split("/").pop();

        let collapseIcon = this.state.collapsed ? faAngleRight : faAngleDown;
        let folderIcon = this.state.collapsed ? faFolder : faFolderOpen;

        return (
            <div className="file-list-folder-container" folder-path={folderPath}>
                <div className="file-list-folder" title={folderPath} onClick={this.toggleCollapse} style={{cursor: "pointer"}}>
                    {/* <span className="folder-remove-icon" onClick={() => FolderDispatcher.removeFolder(folderPath)} title="Remove folder">
                        <FontAwesomeIcon icon={faTimes} size="lg" style={{ cursor: "pointer"}}/>
                    </span> */}
                    <span className="folder-collapse-icon">
                        <FontAwesomeIcon icon={collapseIcon} size="sm"/>
                    </span>
                    <span className="folder-name">
                        <FontAwesomeIcon icon={folderIcon} size="sm"/>{folderName}
                    </span>
                    {/* <span className="folder-add-icon" onClick={() => ModalDispatcher.createFileModal(folderPath)} title="Create new file here" data-no-collapse={true}>
                        <FontAwesomeIcon icon={faPlus} size="lg" style={{ cursor: "pointer"}}/>
                    </span> */}
                </div>
                <div className="file-list-items">
                    {fileElements}
                </div>
            </div>
        );
    }
}