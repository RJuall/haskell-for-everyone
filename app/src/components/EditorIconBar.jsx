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

        this.fontIncrease = () => {
            EditorDispatcher.fontSizePlus();
            this.setState({
                fontSize: (parseInt(this.state.fontSize) + 2).toString() + 'px'
            })
        }

        this.fontDecrease = () => {
            EditorDispatcher.fontSizeMinus();
            this.setState({
                fontSize: (parseInt(this.state.fontSize) - 2).toString() + 'px'
            })
        }

        this.handleModeChange = evt => {
            this.setState({
                mode: evt.mode
            })
        }

        this.handleFileLoad = evt => {
            console.log(evt.pathClean);
        }
    }

    componentDidMount() {
        EditorDispatcher.on("mode-change", this.handleModeChange);
        FileDispatcher.on(FILE_READ, this.handleFileLoad);
    }

    componentWillUnmount() {
        EditorDispatcher.removeListener("mode-change", this.handleModeChange);
        FileDispatcher.removeListener(FILE_READ, this.handleFileLoad);
    }

    render() {
        return(
            <div className="icon-bar">
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