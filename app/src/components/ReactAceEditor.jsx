import React from 'react';
import AceEditor from 'react-ace';
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
            value: '',
            defaultValue: testHask,
            editorProps: {$blockScrolling: true},
            wrapEnabled: false
        };

        // handle file read events 
        this.onFileRead = this.handleFileRead.bind(this);
    }

    // handler when a file is read
    handleFileRead(evt) {
        if(evt.fileName !== this.currFileName){
            // save current file logic 
        }

        // update current file name
        this.currFileName = evt.fileName;
        
        // load in the file's contents 
        this.setState({value: evt.str});
    }

    componentDidMount() {
        FileDispatcher.on(FILE_READ, this.onFileRead);
    }    

    componentWillUnmount() {
        FileDispatcher.removeListener(FILE_READ, this.onFileRead);
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
                ></AceEditor>
            </div>
        )
    }
}

export default ReactAceEditor;
