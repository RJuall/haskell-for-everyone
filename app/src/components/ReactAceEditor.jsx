import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import FileDispatcher, { FILE_READ } from '../dispatchers/FileDispatcher';

import 'brace/mode/haskell';
import 'brace/theme/dracula';
import 'brace/theme/eclipse';
import 'brace/theme/solarized_light'

import {testHask} from './Tokenise';

function onChange(newVal) {
    console.log();
}

class ReactAceEditor extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        FileDispatcher.on(FILE_READ, evt => {
            //evt.str to ed.val
        });
        console.log(testHask);
    }    

    render() {
        return(
            <div>
                <AceEditor
                    mode="haskell"
                    theme="solarized_light"
                    onChange={onChange}
                    name="ace-editor"
                    width="100%"
                    height="100vh"
                    fontSize="22px"
                    editorProps={{$blockScrolling: true}}
                    defaultValue={testHask}
                ></AceEditor>
            </div>
        )
    }
}

export default ReactAceEditor;
