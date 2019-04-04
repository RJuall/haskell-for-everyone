import React from 'react';
import AceEditor from 'react-ace';
import EditorDispatcher from '../dispatchers/EditorDispatcher';
import FileDispatcher, { FILE_READ } from '../dispatchers/FileDispatcher';
import GhciDispatcher from '../dispatchers/GhciDispatcher';
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';

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
import ModalDispatcher from '../dispatchers/ModalDispatcher';

export const ReactAceEditor = inject("editorStore", "fileStore")(observer(class ReactAceEditor extends React.Component {
    constructor(props) {
        super(props);
        // ref for ace editor 
        this.editorRef = React.createRef();

        // changed after save?
        this.changedPostSave = false;
        
        // the settings json data
        this.settings = null;

        // editor ref
        this.editorRef = React.createRef();

        this.state = {
            value: '',
        };

    }

    // handler when a file is read
    handleFileRead = (evt) => {
        if(evt.path !== this.currFilePath){
            // save current file logic before switching
            // replace this for temp files later!  
            FileDispatcher.writeFile(
                this.props.fileStore.fileSettings.lastFilePath,
                this.state.value
            );
        }

        // update current file name
        this.props.fileStore.fileSettings.lastFilePath = evt.path;
        this.props.fileStore.recentPathUpdate(evt.path);

        // set the editor mode
        this.setEditorMode(evt.path);
        
        // load in the file's contents 
        this.setState({value: evt.str}, () => {
            this.resetEditorSession();
        });
    }

    // handler for when the file save button is clicked
    handleSaveFile = () => {
        // blank file? 
        if(!this.props.fileStore.fileSettings.lastFilePath){
            ModalDispatcher.saveFileAsModal();
            return;
        }

        // issue a request to write current code to current file 
        FileDispatcher.writeFile(
            this.props.fileStore.fileSettings.lastFilePath,
            this.state.value
        );
        
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
        if (this.props.editorStore.editorSettings.mode === 'haskell') {
            GhciDispatcher.executeFile(
                this.props.fileStore.fileSettings.lastFilePath,
                this.state.value
            );

            EditorDispatcher.editorChangeReset();
        }
    }

    handleEmptyFile = () => {
        this.props.fileStore.fileSettings.lastFilePath = null;

        this.resetEditorSession();
        this.setState({value: ""});
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
    setEditorMode = action(file => {
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
    })

    componentDidMount() {
        // listen for events
        FileDispatcher.on(FILE_READ, this.handleFileRead);
        EditorDispatcher.on("editor-save-file", this.handleSaveFile);
        EditorDispatcher.on("save-as", this.handleSaveFileAs);
        EditorDispatcher.on("run-code", this.handleRunCode);
        EditorDispatcher.on("empty-file", this.handleEmptyFile);
    }    

    componentWillUnmount() {
        // remove event listeners
        FileDispatcher.removeListener(FILE_READ, this.handleFileRead);
        EditorDispatcher.removeListener("editor-save-file", this.handleSaveFile);
        EditorDispatcher.removeListener("save-as", this.handleSaveFileAs);
        EditorDispatcher.removeListener("run-code", this.handleRunCode);
        EditorDispatcher.removeListener("empty-file", this.handleEmptyFile);
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
                            selectionStyle: "text",
                        }
                    }
                    ref={this.editorRef}                 
                    value={this.state.value}
                    onChange={this.onChange}
                    commands={[{
                        name: 'save',
                        bindKey: {win: 'Ctrl-s', mac: 'Command-s'},
                        exec: () => { EditorDispatcher.saveCurrentFile(); }
                    }
                    ]}
                ></AceEditor>
            </div>
        )
    }
}));