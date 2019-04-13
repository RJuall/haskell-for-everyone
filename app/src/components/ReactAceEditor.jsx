import React from 'react';
import AceEditor from 'react-ace';
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';
import EditorDispatcher from '../dispatchers/EditorDispatcher';
import FileDispatcher, { FILE_READ } from '../dispatchers/FileDispatcher';
import ModalDispatcher from '../dispatchers/ModalDispatcher';
import GhciDispatcher from '../dispatchers/GhciDispatcher';
import WSClient, { CODE, ROOM_LEAVE, ROOM_JOIN } from "../utils/WSClient";

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

export const ReactAceEditor = inject("editorStore", "fileStore")(observer(class ReactAceEditor extends React.Component {
    constructor(props) {
        super(props);
        // ref for ace editor 
        this.editorRef = React.createRef();

        // editor ref
        this.editorRef = React.createRef();

        // use to prevent sending what was just received
        this.processingUpdate = false;
        // updates to process when online but not in online editor 
        this.onlineUpdatesToProcess = [];

        this.onlineEditorCache = "";

        // websocket client listener id for removal on unmount 
        this.wsCallbackId = -1;

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

        // update recent files 
        this.props.fileStore.recentPathUpdate(evt.path);

        // saved so not altered
        this.props.fileStore.fileSettings.currFileAltered = false;

        // if going from online to offline file - cache the edtiro 
        if(this.props.fileStore.fileSettings.onlineFileActive){
            this.onlineEditorCache = this.state.value;
        }

        // opening a file switches to 'offline' editor
        this.props.fileStore.fileSettings.onlineFileActive = false;

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
        this.props.fileStore.fileSettings.currFileAltered = false;
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

            // mark file as same as the save
            this.props.fileStore.fileSettings.currFileAltered = false;
        }
    }

    // "new" file clicked 
    handleEmptyFile = () => {
        this.props.fileStore.fileSettings.lastFilePath = null;

        this.resetEditorSession();
        this.setState({value: ""});
    }

    // switch to online mode 
    handleOnlineFile = () => {
        // online mode setup 
        this.props.fileStore.fileSettings.lastFilePath = null;
        this.props.fileStore.fileSettings.onlineFileActive = true;

        // switch the code editor value to stale 'online file' text
        this.setState({value: this.onlineEditorCache}, () => {
            // editor is now where it was when it was switched to a different file
            // apply updates that arrived while not viewing online file 
            this.onlineUpdatesToProcess.forEach(update => update());
            this.onlineUpdatesToProcess = [];
        });

        // this fixes the undo issues 
        this.resetEditorSession();
    }

    // when the client connects to a room initially 
    handleRoomJoin = ({codeLines}) => {
        // reset room info 
        this.clearRoomData();
        
        // insert each character at corresponding row, col 
        codeLines.forEach((line, row) => {
            line.forEach((code, column) => {
                // generate start end objects from data
                let start = {row, column};              // row, column is always start
                let end = {row, column: column + 1};    // always 1 char so it ends 1 col away 

                // append update function to update array
                // this will be executed when handleOnlineFile is invoked next 
                this.onlineUpdatesToProcess.push(
                    () => this.handleCodeUpdate({code, start, end, action: "insert"})
                );
            });
        });

        // switch to online mode and run updaters 
        this.handleOnlineFile();
    }

    // online document's code has changed 
    handleCodeUpdate = ({code, start=null, end=null, action=null}) => {
        // only update if in online editor mode 
        if(!this.props.fileStore.fileSettings.onlineFileActive){
            // apply this later
            this.onlineUpdatesToProcess.push(() => this.handleCodeUpdate({code, start, end, action}));

            return;
        }

        // apply the update   
        if(start && code && action){
            let session = this.editorRef.current.editor.session;

            this.processingUpdate = true;

            if(action === "insert"){
                let rowDiff = start.row + 1 - session.getLength(); // length is off by 1 (starts at 1 not 0)

                if(rowDiff > 0){
                    // new blank lines have been added
                    let i = start.row - rowDiff + 1;
                    while(i < start.row){
                        // array arg is [[prevLine], [currLine]]
                        session.doc.insertMergedLines({row: i++, col: 0}, [[''], ['']]);
                    }

                    // at this point all blank lines added - just add actual code 
                    session.doc.insertMergedLines({row: i, col: 0}, [[''], code.split("")]);
                }
                else{
                    session.insert(start, code);
                }
            }
            else if(action === "remove"){
                session.remove({start, end});
            }

            this.processingUpdate = false;
        }
    }

    // got an update from the server 
    handleWsClientUpdate = ({type, data}) => {
        switch(type){
            case CODE:
                this.handleCodeUpdate(data);
                break;

            case ROOM_LEAVE:
                this.clearRoomData();
                break;

            case ROOM_JOIN:
                this.handleRoomJoin(data);
                break;
        }
    }

    // when the editor changes... (no longer sync with file)
    onChange = (val, evt) => {
        // mark file as same as the save
        this.props.fileStore.fileSettings.currFileAltered = true;
        this.state.value = val;

        // online?
        if(this.props.fileStore.fileSettings.onlineFileActive && !this.processingUpdate){
            let {start, end, lines, action} = evt;

            // send the update 
            // this deals with write permissions 
            WSClient.sendCode(lines.join(""), start, end, action);
        }        
    }

    // destroys information related to current room 
    clearRoomData(){
        this.onlineEditorCache = "";
        this.onlineUpdatesToProcess = [];
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
        EditorDispatcher.on("online-file", this.handleOnlineFile);

        // listening for websocket updates
        this.wsCallbackId = WSClient.register(this.handleWsClientUpdate);

        // automatically focus this component 
        this.editorRef.current.editor.focus();
    }    

    componentWillUnmount() {
        // remove event listeners
        FileDispatcher.removeListener(FILE_READ, this.handleFileRead);
        EditorDispatcher.removeListener("editor-save-file", this.handleSaveFile);
        EditorDispatcher.removeListener("save-as", this.handleSaveFileAs);
        EditorDispatcher.removeListener("run-code", this.handleRunCode);
        EditorDispatcher.removeListener("empty-file", this.handleEmptyFile);
        EditorDispatcher.removeListener("online-file", this.handleOnlineFile);

        // stop listening for websocket updates
        WSClient.unregister(this.wsCallbackId);
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
                            $blockScrolling: this.props.editorStore.editorSettings.blockScrolling ? Infinity : false,
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
                    onKeyDown={this.onKeyDown}
                    oon
                    commands={[{
                        name: 'save',
                        bindKey: {win: 'Ctrl-s', mac: 'Command-s'},
                        exec: () => { EditorDispatcher.saveCurrentFile(); }
                    },
                    {
                        name: 'run',
                        bindKey: {win: 'Ctrl-l', mac: 'Command-l'},
                        exec: () => { EditorDispatcher.runCode(); }
                    },
                    {
                        name: 'newFile',
                        bindKey: {win: 'Ctrl-n', mac: 'Command-n'},
                        exec: () => { EditorDispatcher.emptyFile(); }
                    },
                    {
                        name: 'fontDecrease',
                        bindKey: {win: 'Ctrl--', mac: 'Command--'},
                        exec: () => {
                            if (parseInt(this.props.editorStore.editorSettings.fontSize) > 8) {
                                Object.assign(
                                    this.props.editorStore.editorSettings,
                                    {
                                    fontSize: (parseInt(this.props.editorStore.editorSettings.fontSize) - 2).toString() + 'px'
                                    }
                                )
                            }
                        }
                    },
                    {
                        name: 'fontIncrease',
                        bindKey: {win: 'Ctrl-=', mac: 'Command-='},
                        exec: () => {
                            if (parseInt(this.props.editorStore.editorSettings.fontSize) < 60) {
                                Object.assign(
                                    this.props.editorStore.editorSettings,
                                    {
                                    fontSize: (parseInt(this.props.editorStore.editorSettings.fontSize) + 2).toString() + 'px'
                                    }
                                )
                            }
                        }
                    }
                    ]}
                ></AceEditor>
            </div>
        )
    }
}));