import React from 'react';
import AceEditor from 'react-ace';
import EditorDispatcher from '../dispatchers/EditorDispatcher';
import FileDispatcher, { FILE_READ } from '../dispatchers/FileDispatcher';
import IpcRequester from "../utils/IpcRequester";
import GhciDispatcher from '../dispatchers/GhciDispatcher';

// import syntax highlighting modes
import 'brace/mode/haskell';
import 'brace/mode/markdown';
import 'brace/mode/plain_text';

// import ce themes
import 'brace/theme/dracula';
import 'brace/theme/solarized_light';
import 'brace/theme/solarized_dark';
import 'brace/theme/terminal';
import 'brace/theme/eclipse';
import 'brace/theme/kuroir';
import 'brace/theme/textmate';
import 'brace/theme/tomorrow';
import 'brace/theme/github';
import 'brace/theme/monokai';
import 'brace/theme/xcode';
import 'brace/theme/twilight';

// allows code completion
import 'brace/ext/language_tools';

// default Haskell code when program starts
import { testHask } from './Tokenise';

class ReactAceEditor extends React.Component {
    constructor(props) {
        super(props);

        // ref for ace editor 
        this.editorRef = React.createRef();
        
        // current file in the editor
        this.currFilePath = null; 

        // changed after save?
        this.changedPostSave = false;
        
        // the settings json data
        this.settings = null;

        this.state = {
            name: "ace-editor",
            mode: "haskell",
            theme: "dracula",
            width: "100%",
            height: "100vh",
            fontSize: "16px",
            defaultValue: testHask,
            editorProps: {$blockScrolling: true},
            setOptions: {
                fontFamily: "Inconsolata, monospace",
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                selectionStyle: "text",
            },
            wrapEnabled: false
        };
    }

    // handler when a file is read
    handleFileRead = (evt) => {
        if(evt.path !== this.currFilePath){
            // save current file logic 
        }

        // update current file name
        this.currFilePath = evt.path;

        // set the editor mode
        this.setEditorMode(evt.path);
        
        // load in the file's contents 
        this.setState({value: evt.str}, () => {
            this.resetEditorSession();
        });
    }

    // handler for when the file save button is clicked
    handleSaveFile = () => {
        // issue a request to write current code to current file 
        FileDispatcher.writeFile(this.currFilePath, this.state.value);
        
        // mark file as same as the save
        this.changedPostSave = false;
        EditorDispatcher.editorChangeReset();
    }

    // handler for when the file save-as button is clicked
    handleSaveFileAs = evt => {
        FileDispatcher.createFile(evt.path, this.state.value);
    }

    // handler for when the current code should be executed
    // will not execute if mode is not set to haskell 
    handleRunCode = () => {
        if (this.state.mode === 'haskell') {
            GhciDispatcher.executeFile(this.currFilePath, this.state.value);
            EditorDispatcher.editorChangeReset();
        }
    }

    // handler for increasing the font size of the ce
    fontSizePlus = () => {
        this.setState({
            fontSize: (parseInt(this.state.fontSize) + 2).toString() + 'px'
        });
     }

    // handler for decreasing the font size of the ce
    fontSizeMinus = () => {
        this.setState({
            fontSize: (parseInt(this.state.fontSize) - 2).toString() + 'px'
        })
    }

    // handler for changing the font family of the ce
    handleFontChange = evt => {
        this.setState({
            setOptions: {
                fontFamily: evt.font
            }
        });
    }

    // handler for changing the theme of the ce
    handleThemeChange = evt => {
        this.setState({
            theme: evt.theme
        })
    }

    // when the editor changes... (no longer sync with file)
    onChange = (val, evt) => {
        this.changedPostSave = true
        EditorDispatcher.editorChangeOcccurred();

        this.state.value = val;
    }

    // resets the editor session 
    resetEditorSession = () => {
        let {editor} = this.editorRef.current;
        if(editor){
            let session = editor.getSession();
            let undoManager = session.getUndoManager();
            
            undoManager.reset();
            session.setUndoManager(undoManager);
        }
    }

    // function that sets the mode state of the ce
    //    based on a file's extension
    //    and emits a modeChange event
    setEditorMode = file => {
        if(!file) return;

        let mode;
        if      (file.endsWith('.hs') 
                 || file.endsWith('.lhs')) {
            this.setState({mode: 'haskell'});
            mode = '.hs';
                 }
        else if (file.endsWith('.md')
                 || file.endsWith('.mkd')
                 || file.endsWith('.mdown')
                 || file.endsWith('.markdown')
                 || file.endsWith('.mkdn')
                 || file.endsWith('.mdwn')
                 || file.endsWith('.mdtxt')
                 || file.endsWith('.mdtext')
                 || file.endsWith('.text')
                 || file.endsWith('.Rmd')) {
            this.setState({mode: 'markdown'});
            mode = '.md';
        }
        else {
            this.setState({mode: 'plain_text'});
            mode = '.txt';
        }
        EditorDispatcher.modeChange(mode);
    }

    componentDidMount() {
        // listen for events
        FileDispatcher.on(FILE_READ, this.handleFileRead);
        EditorDispatcher.on("editor-save-file", this.handleSaveFile);
        EditorDispatcher.on("ce-font-size-plus", this.fontSizePlus);
        EditorDispatcher.on("ce-font-size-minus", this.fontSizeMinus);
        EditorDispatcher.on("save-as", this.handleSaveFileAs);
        EditorDispatcher.on("run-code", this.handleRunCode);
        EditorDispatcher.on("ce-font-family-set", this.handleFontChange);
        EditorDispatcher.on("ce-theme-set", this.handleThemeChange);

        // makes sure that the ce value matches the default value
        this.setState({value: this.state.defaultValue});
    }    

    componentWillUnmount() {
        // remove event listeners
        FileDispatcher.removeListener(FILE_READ, this.handleFileRead);
        EditorDispatcher.removeListener("editor-save-file", this.handleSaveFile);
        EditorDispatcher.removeListener("ce-font-size-plus", this.fontSizePlus);
        EditorDispatcher.removeListener("ce-font-size-minus", this.fontSizeMinus);
        EditorDispatcher.removeListener("save-as", this.handleSaveFileAs);
        EditorDispatcher.removeListener("run-code", this.handleRunCode);
        EditorDispatcher.removeListener("ce-font-family-set", this.handleFontChange);
        EditorDispatcher.removeListener("ce-theme-set", this.handleThemeChange);
    }

    render() {
        return(
            <div>
                <AceEditor
                    ref={this.editorRef}
                    mode={this.state.mode}
                    theme={this.state.theme}
                    name={this.state.name}
                    width={this.state.width}
                    height={this.state.height}
                    fontSize={this.state.fontSize}
                    editorProps={this.state.editorProps}
                    defaultValue={this.state.defaultValue}
                    wrapEnabled={this.state.wrapEnabled}
                    value={this.state.value}
                    setOptions={this.state.setOptions}
                    onChange={this.onChange}
                    commands={[{
                        name: 'save',
                        bindKey: {win: 'Ctrl-s', mac: 'Command-s'},
                        exec: () => { EditorDispatcher.saveCurrentFile(); }
                    }]}
                ></AceEditor>
            </div>
        )
    }
}

export default ReactAceEditor;
