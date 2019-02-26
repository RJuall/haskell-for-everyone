import React from 'react';
import AceEditor from 'react-ace';
import EditorDispatcher from '../dispatchers/EditorDispatcher';
import FileDispatcher, { FILE_READ } from '../dispatchers/FileDispatcher';

import 'brace/mode/haskell';
import 'brace/theme/dracula';
import 'brace/theme/eclipse';
import 'brace/theme/solarized_light'

import {testHask} from './Tokenise';

class ReactAceEditor extends React.Component {
    constructor(props) {
        super(props);
        
        this.currFileName = null;

        this.state = {
            name: "ace-editor",
            mode: "haskell",
            theme: "dracula",
            onChange: (val, evt) => {},
            width: "100%",
            height: "100vh",
            fontSize: "20px",
            defaultValue: testHask,
            editorProps: {$blockScrolling: true},
            setOptions: {fontFamily: "Operator Mono, Fira Code, Lucida Console, Courier, monospace"},
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
        FileDispatcher.on(FILE_READ, this.handleFileRead);
        EditorDispatcher.on("ce-font-size-plus", this.fontSizePlus);
        EditorDispatcher.on("ce-font-size-minus", this.fontSizeMinus);
        this.setState({value: this.state.defaultValue});
    }    

    componentWillUnmount() {
        FileDispatcher.removeListener(FILE_READ, this.handleFileRead);
        EditorDispatcher.removeListener("ce-font-size-plus", this.fontSizePlus);
        EditorDispatcher.removeListener("ce-font-size-minus", this.fontSizeMinus);
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
