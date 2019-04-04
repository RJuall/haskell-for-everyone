import React from 'react';
import EditorDispatcher from '../dispatchers/EditorDispatcher';
import FileDispatcher, { FILE_READ } from '../dispatchers/FileDispatcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faPlay, faMinus, faPlus } from '@fortawesome/pro-regular-svg-icons';
import { FontChooser } from './FontChooser';
import { ThemeChooser } from './ThemeChooser';
import { UIChooser } from './UIChooser';
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';

import './EditorIconBar.css';

export const EditorIconBar = inject("editorStore", "fileStore")(observer(class EditorIconBar extends React.Component {
    constructor(props) {
        super(props);

        // the settings json data
        this.settings = null;

        this.state = {
            filename: '',
        };

        // signals that the ce font size should increase
        //    and sets the fontSize state
        
        this.fontIncrease = action( () => {
            if (parseInt(this.props.editorStore.editorSettings.fontSize) < 60) {
                Object.assign(
                    this.props.editorStore.editorSettings,
                    {
                    fontSize: (parseInt(this.props.editorStore.editorSettings.fontSize) + 2).toString() + 'px'
                    }
                )
            }
        })

        // signals that the ce font size should decrease
        //    and sets the fontsize state
        this.fontDecrease = action( () => {
            if (parseInt(this.props.editorStore.editorSettings.fontSize) > 8) {
                Object.assign(
                    this.props.editorStore.editorSettings,
                    {
                    fontSize: (parseInt(this.props.editorStore.editorSettings.fontSize) - 2).toString() + 'px'
                    }
                )
            }
        })
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
        EditorDispatcher.on("editor-change", this.handleEditorChange);
        EditorDispatcher.on("editor-change-reset", this.handleEditorChangeReset);
    }

    componentWillUnmount() {
        // removes event listeners
        EditorDispatcher.removeListener("editor-change", this.handleEditorChange);
        EditorDispatcher.removeListener("editor-change-reset", this.handleEditorChangeReset);
    }

    render() {
        return(
            <div className="icon-bar">
                <div className="filename">{(this.props.fileStore.fileSettings.lastFilePath || "").split("/").pop()}</div>
                <button></button>
                <button title="Decrease font size" onClick={this.fontDecrease}>
                    <FontAwesomeIcon size="2x" icon={faMinus}/>
                </button>
                <button title="Font Size">{this.props.editorStore.editorSettings.fontSize}</button>
                <button title="Increase font size" onClick={this.fontIncrease}>
                    <FontAwesomeIcon size="2x" icon={faPlus}/>
                </button>
                <FontChooser/>
                <ThemeChooser/>
                <UIChooser/>
                <button className="btn btn-danger btn-run" title="Run" onClick={() => EditorDispatcher.saveCurrentFile()} title="Saves current file">
                    <FontAwesomeIcon icon={faSave}/>
                    <span>Save</span>
                </button>
                <button className="btn btn-danger btn-run" title="Run" onClick={() => EditorDispatcher.runCode()} title="Runs and saves current file">
                    <FontAwesomeIcon icon={faPlay}/>
                    <span>Run</span>
                </button>
            </div>
        );
    }
}));