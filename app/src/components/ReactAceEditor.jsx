import React from 'react';
import AceEditor from 'react-ace';
import EditorDispatcher from '../dispatchers/EditorDispatcher';
import FileDispatcher, { FILE_READ } from '../dispatchers/FileDispatcher';
import IpcRequester from "../utils/IpcRequester";

import 'brace/mode/haskell';
import 'brace/theme/dracula';
import 'brace/theme/eclipse';
import 'brace/theme/solarized_light'
import 'brace/ext/language_tools';

import {testHask} from './Tokenise';

class ReactAceEditor extends React.Component {
    constructor(props) {
        super(props);
        
        // current file in the editor
        this.currFileName = null;

        this.state = {
            name: "ace-editor",
            mode: "haskell",
            theme: "dracula",
            onChange: (val, evt) => {this.state.value = val},
            width: "100%",
            height: "100vh",
            fontSize: "20px",
            defaultValue: testHask,
            editorProps: {$blockScrolling: true},
            setOptions: {
                fontFamily: "Operator Mono, Fira Code, Lucida Console, Courier, monospace",
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true
            },
            wrapEnabled: false
        };
    }

    // handler when a file is read
    handleFileRead = (evt) => {
        if(evt.fileName !== this.currFileName){
            // save current file logic 
        }

        // update current file name
        this.currFileName = evt.fileName;
        
        // load in the file's contents 
        this.setState({value: evt.str});
    }

    // handler for when the file save button is clicked
    handleSaveFile = () => {
        // issue a request to write current code to current file 
        FileDispatcher.writeFile(this.currFileName, this.state.value);
    }

    // handler for teh when file save-as button is clicked
    handleSaveFileAs = evt => {
        FileDispatcher.createFile(evt.fileName, evt.dir, this.state.value);
    }

    fontSizePlus = () => {
        this.setState({
            fontSize: (parseInt(this.state.fontSize) + 2).toString() + 'px'
        });
     }

    fontSizeMinus = () => {
        this.setState({
            fontSize: (parseInt(this.state.fontSize) - 2).toString() + 'px'
        })
    }

    componentDidMount() {
        // request settings file
        IpcRequester.send("settings-get");

        // listen for events
        FileDispatcher.on(FILE_READ, this.handleFileRead);
        EditorDispatcher.on("editor-save-file", this.handleSaveFile);
        EditorDispatcher.on("ce-font-size-plus", this.fontSizePlus);
        EditorDispatcher.on("ce-font-size-minus", this.fontSizeMinus);
        EditorDispatcher.on("save-as", this.handleSaveFileAs);

        this.setState({value: this.state.defaultValue});
    }    

    componentWillUnmount() {
        FileDispatcher.removeListener(FILE_READ, this.handleFileRead);
        EditorDispatcher.removeListener("editor-save-file", this.handleSaveFile);
        EditorDispatcher.removeListener("ce-font-size-plus", this.fontSizePlus);
        EditorDispatcher.removeListener("ce-font-size-minus", this.fontSizeMinus);
        EditorDispatcher.removeListener("save-as", this.handleSaveFileAs);
    }

    render() {
        return(
            <div>
                <AceEditor
                    mode={this.state.mode}
                    theme={this.state.theme}
                    onChange={this.state.onChange}
                    name={this.state.name}
                    width={this.state.width}
                    height={this.state.height}
                    fontSize={this.state.fontSize}
                    editorProps={this.state.editorProps}
                    defaultValue={this.state.defaultValue}
                    wrapEnabled={this.state.wrapEnabled}
                    value={this.state.value}
                    setOptions={this.state.setOptions}
                ></AceEditor>
            </div>
        )
    }
}

export default ReactAceEditor;
