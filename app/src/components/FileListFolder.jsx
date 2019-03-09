import React from "react";
import { faMinusCircle, faPlusCircle } from "@fortawesome/pro-light-svg-icons"
import FolderDispatcher from "../dispatchers/FolderDispatcher";
import ModalDispatcher from "../dispatchers/ModalDispatcher";

export class FileListFolder extends React.Component{
    renderFileItem(){
        return (
            <span className="file-list-item" key={fname} onClick={() => FileDispatcher.readFile(`${folderPath}/${fname}`)}>
                {fname}
                <br/>
            </span>
        );
    }

    render(){
         // array of all file names ending with '.hs' or '.md'
         let fnames = fileNames.filter(fname => fname.includes(".hs") || fname.includes(".md"));

         // return an array of elements 
         let fileElements = fnames.map(fname => this.renderFileItem(fname));

        // folder name is at the end (current naming convention will have no '/' at the end)
        let folderName = folderPath.split("/").pop();

        return (
            <div className="file-list-container" key={folderPath}>
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