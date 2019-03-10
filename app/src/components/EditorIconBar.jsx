import React from 'react';
import EditorDispatcher from '../dispatchers/EditorDispatcher';
import FileDispatcher, { FILE_READ } from '../dispatchers/FileDispatcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faPlay, faMinus, faPlus, faArrowAltSquareLeft, faPaperPlane } from '@fortawesome/pro-regular-svg-icons';
import { FontChooser } from './FontChooser';
import { ThemeChooser } from './ThemeChooser';

import ModalDispatcher from '../dispatchers/ModalDispatcher';

import './EditorIconBar.css';

class EditorIconBar extends React.Component {
    constructor(props) {
        super(props);

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
            let filename = evt.path.split('/').pop();
            this.setState({
                filename: filename
            });
        }
    }

    componentDidMount() {
        // sets up event listeners
        EditorDispatcher.on("mode-change", this.handleModeChange);
        FileDispatcher.on(FILE_READ, this.handleFileLoad);
    }

    componentWillUnmount() {
        // removes event listeners
        EditorDispatcher.removeListener("mode-change", this.handleModeChange);
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