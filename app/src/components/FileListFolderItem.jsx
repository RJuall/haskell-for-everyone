import React from "react";
import { observer, inject } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faHSquare } from "@fortawesome/pro-regular-svg-icons";
import { faMarker } from "@fortawesome/pro-light-svg-icons"
import FileDispatcher from "../dispatchers/FileDispatcher";
import FileListDispatcher, { FILES_DEACTIVATE } from "../dispatchers/FileListDispatcher";

export const FileListFolderItem = inject("fileStore")(observer(class FileListFolderItem extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            active: false  // css active state
        };
    }

    toggleActiveClass = () => {
        this.setState({active: !this.state.active});
    }

    makeActive = () => {
        FileListDispatcher.decativeAllFiles();
        this.setState({active: true});
    }

    // when the signal for all file folder list to deactive comes...
    handleDeactivate = () => {
        this.setState({active: false});
    }

    // on click handler 
    onClick = () => {
        // file path held within this element 
        let filePath = `${this.props.folderPath}/${this.props.fileName}`;

        // don't load same file 
        if(filePath !== this.props.fileStore.fileSettings.lastFilePath){
            this.makeActive();
            FileDispatcher.readFile(filePath);
        }
    }

    componentDidMount(){
        // listen for deactivation
        FileListDispatcher.on(FILES_DEACTIVATE, this.handleDeactivate);
    }

    componentWillUnmount(){
        // stop listening for deactivation 
        FileListDispatcher.removeListener(FILES_DEACTIVATE, this.handleDeactivate);
    }

    render(){
        let fileName = this.props.fileName || "NO_FILE_NAME";

        // extract extension 
        let ext = fileName.split(".").pop();
        let iconType = null;

        // determine icon
        if(ext === "hs"){
            iconType = faHSquare;
        }
        else if(ext === "txt" || ext === "text"){
            iconType = faFileAlt;
        }
        else if(ext === "Rmd" || ext === "md" || ext === "markdown" || ext === "mkd" || ext === "mdown" || ext === "mkdn" || ext === "mdwn" || ext === "mdtext"){
            iconType = faMarker;
        }

        return (
            <div onClick={this.onClick} className={this.state.active ? 'active item-container': 'item-container'}>
            <span className="file-list-item" key={fileName}>
                    <FontAwesomeIcon icon={iconType} size="1x"/> &nbsp; {fileName}
                </span>
            </div>
        );
    }
}));