import React from 'react';
import EditorDispatcher from '../dispatchers/EditorDispatcher';
import FileDispatcher, { FILE_READ } from '../dispatchers/FileDispatcher';
import IpcRequester from '../utils/IpcRequester';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faPlay, faMinus, faPlus, faArrowAltSquareLeft, faPaperPlane } from '@fortawesome/pro-regular-svg-icons';
import { FontChooser } from './FontChooser';
import { ThemeChooser } from './ThemeChooser';

import ModalDispatcher from '../dispatchers/ModalDispatcher';

import './EditorIconBar.css';

class EditorIconBar extends React.Component {
    constructor(props) {
        super(props);

        // the settings json data
        this.settings = null;

        this.state = {
            fontSize: '20px',
            mode: '.hs',
            filename: ''
        };

        // signals that the ce font size should increase
        //    and sets the fontSize state
        this.fontIncrease = () => {
            EditorDispatcher.fontSizePlus();
            this.setState({
                fontSize: (parseInt(this.state.fontSize) + 2).toString() + 'px'
            })
        }

        // signals that the ce font size should decrease
        //    and sets the fontsize state
        this.fontDecrease = () => {
            EditorDispatcher.fontSizeMinus();
            this.setState({
                fontSize: (parseInt(this.state.fontSize) - 2).toString() + 'px'
            })
        }

        // sets the mode state when the syntax
        //    highlighting mode of the ce changes
        this.handleModeChange = evt => {
            this.setState({
                mode: evt.mode
            })
        }

        // sets the filename state when a new file
        //    is loaded into the ce
        this.handleFileLoad = evt => {
            let filename = evt.pathClean.split('/').pop();
            this.setState({
                filename: filename
            });
        }
    }

    // mark file changed 
    handleEditorChange = evt => {
        if(this.state.filename && !this.state.filename.endsWith("*")){
            let filename = `${this.state.filename}*`;
            this.setState({filename});
        }
    }

    // mark file not changed 
    handleEditorChangeReset = evt => {
        let fname = this.state.filename;

        if(fname && fname.endsWith("*")){
            let filename = fname.substring(0, fname.length - 1);
            this.setState({filename});
        }
    }

    componentDidMount() {
        // sets up event listeners
        EditorDispatcher.on("mode-change", this.handleModeChange);
        EditorDispatcher.on("editor-change", this.handleEditorChange);
        EditorDispatcher.on("editor-change-reset", this.handleEditorChangeReset);
        FileDispatcher.on(FILE_READ, this.handleFileLoad);
        IpcRequester.on("settings-get", evt => this.settings = evt.settings);

        // request settings
        IpcRequester.getSettings();
    }

    componentWillUnmount() {
        // removes event listeners
        EditorDispatcher.removeListener("mode-change", this.handleModeChange);
        EditorDispatcher.removeListener("editor-change", this.handleEditorChange);
        EditorDispatcher.removeListener("editor-change-reset", this.handleEditorChangeReset);
        FileDispatcher.removeListener(FILE_READ, this.handleFileLoad);
    }

    render() {
        return(
            <div className="icon-bar">
                <div className="filename">{this.state.filename}</div>
                <button title="New file">
                    <FontAwesomeIcon size="2x" icon={faPaperPlane}/>
                </button>
                <button title="Run" onClick={() => EditorDispatcher.runCode()}>
                    <FontAwesomeIcon size="2x" icon={faPlay}/>
                </button>
                <button title="Save" onClick={() => EditorDispatcher.saveCurrentFile()}>
                    <FontAwesomeIcon size="2x" icon={faSave}/>
                </button>
                <button title="Save as" onClick={() => ModalDispatcher.saveFileAsModal()}>
                    <FontAwesomeIcon size="2x" icon={faArrowAltSquareLeft}/>
                </button>
                <button></button>
                <button title="Decrease font size" onClick={this.fontDecrease}>
                    <FontAwesomeIcon size="2x" icon={faMinus}/>
                </button>
                <button title="Font Size">{this.state.fontSize}</button>
                <button title="Increase font size" onClick={this.fontIncrease}>
                    <FontAwesomeIcon size="2x" icon={faPlus}/>
                </button>
                <FontChooser/>
                <ThemeChooser/>
                <button title="Programming Syntax Mode">{this.state.mode}</button>
            </div>
        );
    }
}

export default EditorIconBar;