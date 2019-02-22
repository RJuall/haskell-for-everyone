import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/pro-light-svg-icons"
import FileDispatcher from "../dispatchers/FileDispatcher";
import FolderDispatcher from "../dispatchers/FolderDispatcher";
import "./FileList.css";

export class FileList extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            folders: {}     // folders to display - {folder: [files]}
        };

        // state update when file names received 
        this.onFileNames = evt => {
            if(!evt.err){
                // copy current state folders
                let folders = {...this.state.folders};

                // extract file names array and folder (dir) from event
                let {fileNames=[], dir=""} = evt;

                // update the folder data in the updated folders object
                folders[dir] = fileNames;

                // update the state 
                this.setState({folders});
            }
        }

        // request files in folder when a folder is received
        this.onFolderPaths = evt => {
            if(!evt.err){
                // extract folder paths array from event
                let folderPaths = evt.folderPaths || [];

                // request the files in each folder
                // (which eventually re-renders)
                this.requestFileNames(folderPaths);
            }
        };

        // handles a folder add response/update
        this.onFolderAdd = evt => {
            if(!evt.err){
                // add folder by path
                let path = evt.path || "";

                // get files for path
                // this triggers the adding folder to the UI 
                this.requestFileNames([path]);
            }
        };

        // handles a folder remove response/update
        this.onFolderRemove = evt => {
            if(!evt.err){
                // get path of folder to remove
                let path = evt.path || "";
                // copy folders 
                let folders = {...this.state.folders};

                // remove folders from copy
                delete folders[path];

                // update state with copy 
                this.setState({folders});
            }
        };

        // handles a folder reset (clear) response/update
        this.onFolderReset = evt => this.setState({folders: {}});
    }

    // requests the the file names array for each folder in the array
    // @param folderPaths   array of folder path strings 
    requestFileNames(folderPaths){
        folderPaths.forEach(folderPath => {
            // get names and update state 
            FileDispatcher.getFileNames(folderPath);
        });
    }

    componentDidMount(){
        // listen for folder path updates
        FolderDispatcher.on("folder-list", this.onFolderPaths);

        // listen for folder adds
        FolderDispatcher.on("folder-add", this.onFolderAdd);

        // listen for folder removals
        FolderDispatcher.on("folder-remove", this.onFolderRemove);

        // listen for folder reset
        FileDispatcher.on("folder-reset", this.onFolderReset);

        // listen for file names update
        FileDispatcher.on("files-get", this.onFileNames);

        // get folder paths when component mounts  
        FolderDispatcher.getFolderPaths();
    }

    componentWillUnmount(){
        // stop listening for folder paths update
        FolderDispatcher.removeListener("folder-list", this.onFolderPaths);

        // listen for folder adds
        FolderDispatcher.removeListener("folder-add", this.onFolderAdd);

        // listen for folder removals
        FolderDispatcher.removeListener("folder-remove", this.onFolderRemove);

        // listen for folder reset
        FileDispatcher.removeListener("folder-reset", this.onFolderReset);

        // stop listening for file names update
        FileDispatcher.removeListener("files-get", this.onFileNames);
    }

    // renders the folder element (folder name + file list)
    // @param folderPath    the folder's path
    // @param fileNames     array of file names that are inside the folder 
    renderFolder(folderPath, fileNames){
        // array of all file names ending with '.hs'
        let fnames = fileNames.filter(fname => fname.includes(".hs"));

        // return an array of elements 
        let fileElements = fnames.map(fname => {
            return (
                <span className="file-list-item" key={fname} onClick={() => FileDispatcher.readFile(folderPath + fname)}>
                    {fname}
                    <br/>
                </span>
            );
        }); 

        return (
            <div className="file-list-container" key={folderPath}>
                <div className="file-list-folder">
                    <span onClick={() => FolderDispatcher.removeFolder(folderPath)}>
                        <FontAwesomeIcon icon={faMinusCircle} style={{color: "red", cursor: "pointer"}}/>
                    </span>
                    &nbsp;
                    {folderPath}
                </div>
                <div className="file-list-items">
                    {fileElements}
                </div>
            </div>
        );
    }

    // renders the all the folder elements
    renderFolders(){
        // array of elements to return 
        let folderElements = [];

        // for each folder... create some html for that folder (name + files)
        let fileNames;
        for(let folderPath in this.state.folders){
            // get all file names in current folder
            fileNames = this.state.folders[folderPath] || null;

            // render the folder element and store it in the results array
            folderElements.push(this.renderFolder(folderPath, fileNames));
        }

        return folderElements;
    }

    render(){
        return (
            <div>
                <div>
                    Files
                </div>
                <div>
                    {this.renderFolders()}
                </div>
            </div>
        );
    }
}