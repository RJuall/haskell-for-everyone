import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faCircleNotch, faMarker} from "@fortawesome/pro-light-svg-icons"
import FolderDispatcher from "../dispatchers/FolderDispatcher";
import FileDispatcher from "../dispatchers/FileDispatcher";
import ModalDispatcher from "../dispatchers/ModalDispatcher";
import { FILE_EXTENSIONS } from "../utils/FileExtension";
import FileListDispatcher, { FOLDERS_DEACTIVATE } from "../dispatchers/FileListDispatcher";
import { faH1, faFileAlt, faHSquare } from "@fortawesome/pro-regular-svg-icons";

export class FileListFolder extends React.Component{

    constructor(props){
        super(props);
        this.toggleActiveClass= this.toggleActiveClass.bind(this);
        this.state = {
            active: false,
        };
    }

    toggleActiveClass() {
        FileDispatcher.currentFolderPath = this.props.folderPath;
        FileListDispatcher.deactivateAllFolders();

        //this.setState({ active: !this.state.active });
        this.setState({active: true});
    };

    // when the signal for all file folder list to deactive comes...
    handleDeactivate = () => {
        this.setState({active: false});
    }

    componentDidMount(){
        // listen for deactivation
        FileListDispatcher.on(FOLDERS_DEACTIVATE, this.handleDeactivate);
    }

    componentWillUnmount(){
        // stop listening for deactivation 
        FileListDispatcher.removeListener(FOLDERS_DEACTIVATE, this.handleDeactivate);
    }

    renderFileItem(fname){
        // extract extension 
        let ext = fname.split(".").pop();
        let iconType = null;

        // determine icon
        if(ext === "hs"){
            iconType = faHSquare;
        }
        else if(ext === "txt" || ext === "text"){
            iconType = faFileAlt;
        }
        else if(ext === "Rmd" || ext === "md" || ext == "markdown" || ext === "mkd" || ext === "mdown" || ext === "mkdn" || ext === "mdwn" || ext === "mdtext"){
            iconType = faMarker;
        }

        return (
            <div key={fname} onClick={this.toggleActiveClass} className={this.state.active ? 'active item-container': 'item-container'}>
            <span className="file-list-item" key={fname} onClick={() => FileDispatcher.readFile(`${this.props.folderPath}/${fname}`)}>
                    <FontAwesomeIcon icon={iconType} size="lg" style={{color: "white"}}/> &nbsp; {fname}
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
                    <span className="folder-remove-icon" onClick={() => FolderDispatcher.removeFolder(folderPath)} title="Remove folder">
                        <FontAwesomeIcon icon={faTimes} size="lg" style={{color: "white", cursor: "pointer"}}/>
                    </span>
                    <span className="folder-name">
                    {folderName}
                    </span>
                    <span className="folder-add-icon" onClick={() => ModalDispatcher.createFileModal(folderPath)} title="Create new file here">
                        <FontAwesomeIcon icon={faPlus} size="lg" style={{color: "white", cursor: "pointer"}}/>
                    </span>
                </div>
                <div className="file-list-items">
                    {fileElements}
                </div>
            </div>
        );
    }
}