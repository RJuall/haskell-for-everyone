import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/pro-light-svg-icons"
import FileDispatcher, { FILES_GET, FILE_CREATE } from "../dispatchers/FileDispatcher";
import FolderDispatcher, { FOLDER_LIST, FOLDER_ADD, FOLDER_REMOVE, FOLDER_RESET} from "../dispatchers/FolderDispatcher";
import ModalDispatcher from "../dispatchers/ModalDispatcher";
import "./FileList.css";
import { FileListFolder } from "./FileListFolder";

export class FileList extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            folders: {}     // folders to display - {folder: [files]}
        };

        // secret input[type=folder] element for selecting folders
        this.folderRef = React.createRef();
    }

    // requests the the file names array for each folder in the array
    // @param folderPaths   array of folder path strings 
    requestFileNames(folderPaths){
        folderPaths.forEach(folderPath => {
            // get names and update state 
            FileDispatcher.getFileNames(folderPath);
        });
    }

    // state update when file names received 
    handleFileNames = evt => {
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
        else ModalDispatcher.alertModal("Folder Files Error", evt.err);
    }

    // handle file create by updating folder
    handleFileCreate = evt => {
        if(!evt.err){
            if(evt.knownFolder){
                // update current list
                this.requestFileNames([evt.dir]);
            }
            else{
                // add list (which updates also)
                FolderDispatcher.addFolder(evt.dir);
            }
        }
        else ModalDispatcher.alertModal("File Create Error", evt.err);
    }

    // request files in folder when a folder is received
    handleFolderPaths = evt => {
        if(!evt.err){
            // extract folder paths array from event
            let folderPaths = evt.folderPaths || [];

            // request the files in each folder
            // (which eventually re-renders)
            this.requestFileNames(folderPaths);
        }
    }

    // handles a folder add response/update
    handleFolderAdd = evt => {
        if(!evt.err){
            // add folder by path
            let path = evt.path || "";

            // get files for path
            // this triggers the adding folder to the UI 
            this.requestFileNames([path]);
        }
        else ModalDispatcher.alertModal("Folder Add Error", evt.err);
    };

    // handles a folder remove response/update
    handleFolderRemove = evt => {
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
        else ModalDispatcher.alertModal("Folder Remove Error", evt.err);
    }

    // handles a folder reset (clear) response/update
    handleFolderReset = () => {
        this.setState({folders: {}});
    }

    componentDidMount(){
        // listen for folder path updates
        FolderDispatcher.on(FOLDER_LIST, this.handleFolderPaths);

        // listen for folder adds
        FolderDispatcher.on(FOLDER_ADD, this.handleFolderAdd);

        // listen for folder removals
        FolderDispatcher.on(FOLDER_REMOVE, this.handleFolderRemove);

        // listen for folder reset
        FileDispatcher.on(FOLDER_RESET, this.handleFolderReset);
        
        // listen for file creation
        FileDispatcher.on(FILE_CREATE, this.handleFileCreate);

        // listen for file names update
        FileDispatcher.on(FILES_GET, this.handleFileNames);

        // get folder paths when component mounts  
        FolderDispatcher.getFolderPaths();
    }

    componentWillUnmount(){
        // stop listening for folder paths update
        FolderDispatcher.removeListener(FOLDER_LIST, this.handleFolderPaths);

        // stop listening for folder adds
        FolderDispatcher.removeListener(FOLDER_ADD, this.handleFolderAdd);

        // stop listening for folder removals
        FolderDispatcher.removeListener(FOLDER_REMOVE, this.handleFolderRemove);

        // stop listening for folder reset
        FileDispatcher.removeListener(FOLDER_RESET, this.handleFolderReset);

        // stop listening for file creation
        FileDispatcher.removeListener(FILE_CREATE, this.handleFileCreate);

        // stop listening for file names update
        FileDispatcher.removeListener(FILES_GET, this.handleFileNames);
    }

    // handler for the when the user selects a folder 
    onFolderSelect(evt){
        // file[0] = folder not an actual file apparent! 
        let path = evt.target.files[0].path.replace(/\\/g, "/");

        // trigger the add folder mec1hanism 
        FolderDispatcher.addFolder(path);
    }

    // renders the all the folder elements
    renderFolders(){
        // array of elements to return 
        let folderElements = [];

        // for each folder... create some html for that folder (name + files)
        let fileNames;
        for(let folderPath in this.state.folders){
            // get all file names in current folder
            fileNames = this.state.folders[folderPath] || [];

            // render the folder element and store it in the results array
            folderElements.push(
                <FileListFolder key={folderPath} folderPath={folderPath} fileNames={fileNames}/>
            );
        }

        return folderElements;
    }
    
    // renders the hidden input for selecting folders
    renderSecretFolderInput(){
        return (
            <input
                ref={this.folderRef}
                type="file"
                webkitdirectory=""
                hidden={true}
                onInput={this.onFolderSelect.bind(this)}
            />
        );
    }

    render(){
        return (
            <div className="file-list-container">
                <div>
                    Files
                    &nbsp;
                    <span onClick={() => this.folderRef.current.click()}>
                        <FontAwesomeIcon icon={faPlusCircle} style={{color: "green", cursor: "pointer"}}/>
                    </span>
                </div>
                <div>
                    {this.renderFolders()}
                </div>
                {this.renderSecretFolderInput()}
            </div>
        );
    }
}