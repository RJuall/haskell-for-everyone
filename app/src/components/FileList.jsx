import React from "react";
import FileDispatcher from "../dispatchers/FileDispatcher";
import "./FileList.css";

export class FileList extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            fileNames: [] // file names array (null won't cause errs)
        };

        // state update when file names received 
        this.onFileNames = evt => {
            if(!evt.err){
                this.setState({fileNames: evt.fileNames});
            }
        }
    }

    requestFileNames(){
        // get names and update state 
        FileDispatcher.getFileNames("sample_hs/");
    }

    componentDidMount(){
        // listen for file names update
        FileDispatcher.on("get-files", this.onFileNames);

        // get files name when component mounts  
        this.requestFileNames();
    }

    componentWillUnmount(){
        // stop listening for file names update
        FileDispatcher.removeListener("get-files", this.onFileNames);
    }

    renderFileItems(){
        // must have files names to create list items
        if(!this.state.fileNames || !this.state.fileNames.length){
            return []; // no files 
        }

        // array of all file names ending with '.hs'
        let fnames = this.state.fileNames.filter(fname => fname.includes(".hs"));

        // return an array of elements 
        // sample_hs (directory) should be dynamic in the future 
        return fnames.map(fname => { 
            return (
                <span className="file-list-item" onClick={() => FileDispatcher.readFile(fname)}>
                    {fname}
                </span>
            );
        });
    }

    render(){
        return (
            <div>
                <div>
                </div>
                <div>
                    {this.renderFileItems()}
                </div>
            </div>
        );
    }
}