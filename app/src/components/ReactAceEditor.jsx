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

// import 'brace/ext/searchbox';

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

export const ReactAceEditor = inject("editorStore", "fileStore","windowStore")(observer(class ReactAceEditor extends React.Component {
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
        // text value of online file 
        this.onlineEditorCache = "";
        // edit permissions 
        this.onlineEditType = null;

        // websocket client listener id for removal on unmount 
        this.wsCallbackId = -1;

        //to move cursor in editor
        this.move = React.createRef();
        this.move = -1;

        //ref to get text as array and filter array
        this.textArr = React.createRef();
        this.textArr = [];
        this.filteredTextArr = React.createRef();
        this.filteredTextArr = [];

        //arrays to store line numbers and column numbers
        this.lineNum = React.createRef();
        this.lineNum = [];
        this.colNum = React.createRef();
        this.colNum = [];

        // search value
        this.searchVal = React.createRef();
        this.searchVal = "";

        this.state = {
            value: '',
            canEdit: true
        };

        window.addEventListener("keyup", () => {
            this.handleReplace("x", "b");
        })
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
        this.setState({value: evt.str, canEdit: true}, () => {
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
        this.props.fileStore.fileSettings.onlineFileActive = false;

        this.resetEditorSession();
        this.setState({value: "", canEdit: true});
    }

    // switch to online mode 
    handleOnlineFile = () => {
        // online mode setup 
        this.props.fileStore.fileSettings.lastFilePath = null;
        this.props.fileStore.fileSettings.onlineFileActive = true;

        // editable?
        let canEdit = this.onlineEditType === "anyone" || WSClient.isRoomOwner;

        // switch the code editor value to stale 'online file' text
        this.setState({value: this.onlineEditorCache, canEdit}, () => {
            // editor is now where it was when it was switched to a different file
            // apply updates that arrived while not viewing online file 
            this.onlineUpdatesToProcess.forEach(update => update());
            this.onlineUpdatesToProcess = [];
        });

        // this fixes the undo issues 
        this.resetEditorSession();
    }

    // when the client connects to a room initially 
    handleRoomJoin = ({err, codeLines, editType}) => {
        if(err) return;     // failed to join room 

        // reset room info 
        this.clearRoomData();

        // store edit type
        this.onlineEditType = editType;
        
        // append update function to update array
        // this will be executed when handleOnlineFile is invoked next 
        let lastLine = codeLines.length - 1;
        let start = {row: 0, column: 0};
        let end = {row: lastLine, column: codeLines[lastLine].length};

        this.onlineUpdatesToProcess.push(
            () => this.handleCodeUpdate({codeLines, start, end, action: "insert"})
        );

        // switch to online mode and run updaters 
        this.handleOnlineFile();
    }

    // online document's code has changed 
    handleCodeUpdate = ({codeLines, start=null, end=null, action=null}) => {
        // only update if in online editor mode 
        if(!this.props.fileStore.fileSettings.onlineFileActive){
            // apply this later
            this.onlineUpdatesToProcess.push(() => this.handleCodeUpdate({codeLines, start, end, action}));

            return;
        }

        // apply the update   
        if(start && codeLines && action){
            let session = this.editorRef.current.editor.session;

            this.processingUpdate = true;

            if(action === "insert"){
                let {column, row} = start;

                codeLines.forEach(line => {

                    if(row >= session.getLength()){
                        session.doc.insertLines(row, [line]);
                    }
                    else{
                        session.insert({row, column}, line)
                    }

                    column = 0;
                    row++;
                });

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
                this.props.fileStore.fileSettings.onlineFileActive = false;
                this.setState({canEdit: true});
                this.clearRoomData();
                break;

            case ROOM_JOIN:
                this.handleRoomJoin(data);
                break;

            case "close":
                this.props.fileStore.fileSettings.onlineFileActive = false;
                break;
        }
    }

    handleUndo = () => {
        // handle the undo event triggered from menubar
        this.editorRef.current.editor.session.getUndoManager().undo();
    }

    handleRedo = () => {
        // handle the redo event triggered from menubar
        this.editorRef.current.editor.session.getUndoManager().redo();
    }

    handleFind = (search,choice) =>{
        // handle the find event triggered from the search menu
        let text = this.state.value;
        this.textArr = text.split('\n'); //split into array hold each line as an element
        this.searchVal = search; // set global value for search 

        var idx = 0;
        // Loop through array and push line numbers that contain the search paremeters
        this.lineNum = [];
        this.textArr.forEach((val,i) => {
            if(val.includes(search)){
                for(idx; (idx = val.indexOf(search,idx)) >= 0; idx++){
                    this.lineNum.push(i);
                }
            }
        })

        // filter out so only lines remaining are the lines with only the search paremeters
        this.filteredTextArr = this.textArr.filter((str, i) => this.lineNum.indexOf(i) > -1);
        //let correctRow = indexArray.map(val => val+1);
        var index = -1;
        // Fill column array with the number in the line that the search parameter starts at
        this.colNum = [];
        this.filteredTextArr.forEach((val,i) =>{
            do{
                index = val.indexOf(search, index+1);
                if(index >= 0){
                    this.colNum.push(index);
                }
            }while(index >= 0);          
        })

        console.log("Length of "+this.searchVal+ ": "+this.searchVal.length);
        for(var i = 0;i <this.lineNum.length;i++){
            console.log("Line Number: "+this.lineNum[i]);
            console.log("starts at: "+this.colNum[i]);
            console.log("Search Parameter ends at: "+(this.colNum[i]+this.searchVal.length+1));
            let check = this.textArr[this.lineNum[i]].substring(this.colNum[i],(this.colNum[i]+this.searchVal.length+1));
            console.log(check);
            let checkNumber = check.substring(check.length-1);
            console.log(checkNumber);
            var hasNum = checkNumber.match(/\d+/g);
            if(hasNum){
                this.lineNum.splice(i,1);
                this.colNum.splice(i,1);
            }
        }

        console.log(this.lineNum);
        console.log(this.colNum);

        // Go to a line in the editor based on whether next/previous were clicked.
        if(choice === "Next"){
            // move forward in arrays
            if(++this.move >= this.lineNum.length){
                this.move = 0
            }
        }else{
            // move backwards in arrays
            if(--this.move < 0){
                this.move = 0
            }
        }
        // move to current element in array based on the value of this.move
        this.editorRef.current.editor.selection.moveTo(this.lineNum[this.move],this.colNum[this.move]); 
    }
 
    replaceAt = (start,end,str,replace) => {
        return str.substr(0, start) + replace + str.substr(end, str.length);
    };

    handleReplace = (replace, choice) => {
        // Handle Replace event triggered by the search bar
        if(choice === "one"){
            // the choice is one so only replace at current element
            if(this.move != -1){
                this.textArr[this.lineNum[this.move]] = this.replaceAt(this.colNum[this.move],this.colNum[this.move]+this.searchVal.length,
                    this.textArr[this.lineNum[this.move]],replace);
            }
            // remove the replaced elements line and column number from arrays
            this.lineNum.splice(this.move,1);
            this.colNum.splice(this.move,1);
            // move to next element in array
            this.editorRef.current.editor.selection.moveTo(this.lineNum[this.move],this.colNum[this.move]);
            // change the the text in the editor 
            let textStringOne = this.textArr.join('\n');
            this.setState({value: textStringOne});
        }else if(choice ==="all"){
            if(!this.searchVal){
                // replace all with empty this.searchVal causes insane results! 
                return;
            }

            // choice is all so replace every instance of the search parameter
            // ignoring what has been replaced by the one choice if any have been chnaged at all.
            //let textStringAll = this.textArr.join('\n');
            let re = new RegExp(`(${this.searchVal})(?=\\s|$)`, "g");

            // replace
            let replaceString = this.state.value.replace(re, replace);

            // update editor
            this.setState({value: replaceString}, () => {
                // update text array 
                this.textArr = this.state.value.split("\n");
                // reset find/replace (might not be neccessary?)
                this.move = -1;
                this.lineNum = [];
                this.colNum = [];
            });
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
            WSClient.sendCode(lines, start, end, action);
        }        
    }

    // destroys information related to current room 
    clearRoomData(){
        this.onlineEditorCache = "";
        this.onlineUpdatesToProcess = [];
        this.onlineEditType = null;
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

    toggleSearchBar = () => {
        //If true then show the searchbar, else if false then hide the search bar
        Object.assign(this.props.windowStore.windowSettings,{showSearch: true});
    }

    componentDidMount() {
        // listen for events
        FileDispatcher.on(FILE_READ, this.handleFileRead);
        EditorDispatcher.on("editor-save-file", this.handleSaveFile);
        EditorDispatcher.on("save-as", this.handleSaveFileAs);
        EditorDispatcher.on("run-code", this.handleRunCode);
        EditorDispatcher.on("empty-file", this.handleEmptyFile);
        EditorDispatcher.on("online-file", this.handleOnlineFile);
        EditorDispatcher.on("undo", this.handleUndo);
        EditorDispatcher.on("redo", this.handleRedo);
        EditorDispatcher.on("find", this.handleFind);
        EditorDispatcher.on("replace",this.handleReplace);

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
        EditorDispatcher.removeListener("undo",this.handleUndo);
        EditorDispatcher.removeListener("redo", this.handleRedo);
        EditorDispatcher.removeListener("find", this.handleFind);
        EditorDispatcher.removeListener("replace",this.handleReplace);

        // stop listening for websocket updates
        WSClient.unregister(this.wsCallbackId);
    }

    render() {
        return(
            <div>
                
                <AceEditor
                    readOnly={!this.state.canEdit}
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
                    },
                    {
                        name:'find',
                        bindKey:{win: 'Ctrl-f',mac: 'Command-f'},
                        exec:() =>{this.toggleSearchBar()}
                    }
                    ]}
                ></AceEditor>
            </div>
        )
    }
}));