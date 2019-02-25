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
            wrapEnabled: false,
        };
    }

    componentDidMount() {
        FileDispatcher.on(FILE_READ, evt => {
            this.state.value = evt.str;
        });
        console.log(testHask);
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
                ></AceEditor>
            </div>
        )
    }
}

export default ReactAceEditor;
