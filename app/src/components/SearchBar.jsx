import React from 'react';
import EditorDispatcher from '../dispatchers/EditorDispatcher';
import FileDispatcher, { FILE_READ } from '../dispatchers/FileDispatcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';

export const SearchBar = inject("editorStore", "fileStore","windowStore")(observer(class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            inputValue : "",
        };

        this.searchInput = React.createRef();
    }

    closeSearch(){
        console.log("Close search bar");
        Object.assign(this.props.windowStore.windowSettings,{showSearch: false});
    }

    render() {
        // file name to display 
        let fileName = (this.props.fileStore.fileSettings.lastFilePath || "").split("/").pop();

        return(
            <div className="search-bar">
                <input ref={this.searchInput} placeholder="Find"></input>
                <button className="btn" onClick={() => EditorDispatcher.find(this.searchInput.current.value)} value={this.state.inputValue}>Search</button>
                <input ref={this.replaceInput} placeholder="Replace"></input>
                <button className="btn">Replace</button>
                <button className="escButton" onClick={() => this.closeSearch()}>&#10005;</button>
            </div>
        );
    }
}));