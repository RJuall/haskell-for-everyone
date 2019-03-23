import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faHSquare } from "@fortawesome/pro-regular-svg-icons";
import { faMarker } from "@fortawesome/pro-light-svg-icons"
import FileDispatcher from "../dispatchers/FileDispatcher";
import FileListDispatcher, { FILES_DEACTIVATE } from "../dispatchers/FileListDispatcher";

export class FileListFolderItem extends React.Component{
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
            <div onClick={() => FileDispatcher.readFile(`${this.props.folderPath}/${fileName}`)} className={this.state.active ? 'active item-container': 'item-container'}>
            <span className="file-list-item" key={fileName}>
                    <FontAwesomeIcon icon={iconType} size="1x"/> &nbsp; {fileName}
                </span>
            </div>
        );
    }
}