import React from 'react';
import AceEditor from 'react-ace';
import EditorDispatcher from '../dispatchers/EditorDispatcher';
import FileDispatcher, { FILE_READ } from '../dispatchers/FileDispatcher';
import IpcRequester from "../utils/IpcRequester";
import GhciDispatcher from '../dispatchers/GhciDispatcher';
import { observer, inject } from 'mobx-react';

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

export const ReactAceEditor = inject("editorStore")(observer(class ReactAceEditor extends React.Component {
    constructor(props) {
        super(props);

        //this.editorStore = EditorStore;
        
        // current file in the editor
        this.currFilePath = null; 

        // changed after save?
        this.changedPostSave = false;
        
        // the settings json data
        this.settings = null;

        this.state = {
            value: '',
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
        this.setState({value: evt.str});
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

    // when the editor changes... (no longer sync with file)
    onChange = (val, evt) => {
        this.changedPostSave = true
        EditorDispatcher.editorChangeOcccurred();

        this.state.value = val;
    }

    // function that sets the mode state of the ce
    //    based on a file's extension
    //    and emits a modeChange event
    setEditorMode = file => {
        if(!file) return;

        if      (file.endsWith('.hs') 
                 || file.endsWith('.lhs')) {
            Object.assign(this.props.editorStore.editorSettings, {mode: 'haskell'});
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
            Object.assign(this.props.editorStore.editorSettings, {mode: 'markdown'});
        }
        else {
            Object.assign(this.props.editorStore.editorSettings, {mode: 'plain_text'});
        }
    }

    componentDidMount() {
        // listen for events
        FileDispatcher.on(FILE_READ, this.handleFileRead);
        EditorDispatcher.on("editor-save-file", this.handleSaveFile);
        EditorDispatcher.on("save-as", this.handleSaveFileAs);
        EditorDispatcher.on("run-code", this.handleRunCode);
    }    

    componentWillUnmount() {
        // remove event listeners
        FileDispatcher.removeListener(FILE_READ, this.handleFileRead);
        EditorDispatcher.removeListener("editor-save-file", this.handleSaveFile);
        EditorDispatcher.removeListener("save-as", this.handleSaveFileAs);
        EditorDispatcher.removeListener("run-code", this.handleRunCode);
    }

    render() {
        return(
            <div>
                <AceEditor
                    mode={this.props.editorStore.editorSettings.mode}
                    theme={this.props.editorStore.editorSettings.theme}
                    name={this.props.editorStore.editorSettings.name}
                    width={this.props.editorStore.editorSettings.width}
                    height={this.props.editorStore.editorSettings.height}
                    fontSize={this.props.editorStore.editorSettings.fontSize}
                    editorProps={
                        {
                            $blockScrolling: this.props.editorStore.editorSettings.blockScrolling,
                        }
                    }
                    wrapEnabled={this.props.editorStore.editorSettings.wrapEnabled}
                    setOptions={
                        {
                            fontFamily: this.props.editorStore.editorSettings.fontFamily,
                            enableBasicAutocompletion: this.props.editorStore.editorSettings.enableBasicAutocompletion,
                            enableLiveAutocompletion: this.props.editorStore.editorSettings.enableLiveAutocompletion,
                            enableSnippets: this.props.editorStore.editorSettings.enableSnippets,
                        }
                    }
                    value={this.state.value}
                    onChange={this.onChange}
                ></AceEditor>
            </div>
        )
    }
}));