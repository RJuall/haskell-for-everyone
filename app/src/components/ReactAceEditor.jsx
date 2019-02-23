import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/haskell';
import 'brace/theme/dracula';

function   
onChange(newVal) {
    console.log('change', newVal);
}

class ReactAceEditor extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <AceEditor
                    mode="haskell"
                    theme="dracula"
                    onChange={onChange}
                    name="ace-editor"
                    editorProps={{$blockScrolling: true}}
                ></AceEditor>
            </div>
        )
    }
}

export default ReactAceEditor;
