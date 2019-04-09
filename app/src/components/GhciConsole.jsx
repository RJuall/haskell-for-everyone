import React from "react";
import GhciDispatcher, { GHCI, GHCI_ERROR, GHCI_CLEAR } from "../dispatchers/GhciDispatcher";
import ModalDispatcher from "../dispatchers/ModalDispatcher";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./GhciConsole.css";
import { faBroom } from "@fortawesome/pro-light-svg-icons";

export class GhciConsole extends React.Component{
    constructor(props){
        super(props);

        this.historyDepth = 0;
        this.commandHistory = [];

        // input <input> element ref
        this.inputRef = React.createRef();
        // output <textarea> element ref
        this.consoleRef = React.createRef();
    }

    // handle ghci data
    handleGhci = evt => {
        // output element
        let elem = this.consoleRef.current;
        // text update 
        let text = evt.err || evt.str || "";

        // append text to output 
        if(!elem.value.length){
            // set text if empty 
            this.consoleRef.current.value = text;
        }
        else{
            // append text on bottom 
            elem.value +=  text;
            // scroll to bottom
            elem.scrollTop = elem.scrollHeight;
        }
    }

    // handles ghci error (most likely missing haskell platform)
    handleGhciError = evt => {
        // alert user of error 
        let body = evt.err || "(Error occurred, but not error message provided";
        ModalDispatcher.alertModal("GHCi Error", body);
    }

    // handles ghci clearing 
    handleGhciClear = evt => {
       // output element
       let elem = this.consoleRef.current;
       // clear
       elem.value = "";
    }

    componentDidMount(){
        // listen for ghci text
        GhciDispatcher.on(GHCI, this.handleGhci);
        // listen for ghci clear
        GhciDispatcher.on(GHCI_CLEAR, this.handleGhciClear);
        // listen for ghci error
        GhciDispatcher.on(GHCI_ERROR, this.handleGhciError);

        GhciDispatcher.init();
    }

    componentWillUnmount(){
        // stop listening for ghci text
        GhciDispatcher.removeListener(GHCI, this.handleGhci);
        // stop listening for ghci clear
        GhciDispatcher.removeListener(GHCI_CLEAR, this.handleGhciClear);
        // stop listening for ghci error
        GhciDispatcher.removeListener(GHCI_ERROR, this.handleGhciError);
    }

    submitCommand(){
        let elem = this.inputRef.current;       // input element ref
        let code = elem.value.trim();           // code in element
        let outElem = this.consoleRef.current;  // output elem ref

        // only send if there is actual code (aka user is not spamming enter)
        if(code.length){
            // display current input in the output 
            outElem.value += (outElem.value.endsWith("\n")) ? `\n{code}\n` : `${code}\n`;

            // clear the input element
            elem.value = "";

            // send the code 
            GhciDispatcher.executeCode(code);

            // remember the command 
            this.commandHistory.push(code);
            
            // reset 'current' index
            this.historyDepth = 0;
        }
    }

    displayPrevCommand(){
        // increase history index 
        this.historyDepth = Math.min(this.historyDepth + 1, this.commandHistory.length );

        // display  command
        this.displayCommandAtHistoryDepth();
    }

    displayNextCommand(){
        // decreaste history index 
        this.historyDepth = Math.max(this.historyDepth - 1, 0);

        // display command
        this.displayCommandAtHistoryDepth();
    }

    // displays the remembered command at the current history depth
    displayCommandAtHistoryDepth(){
        // get index from depth
        let commandIndex = this.commandHistory.length - this.historyDepth;

        // get command at index 
        let lastCommand = this.commandHistory[commandIndex] || "";

        // display command if possible
        if(lastCommand){
            this.inputRef.current.value = lastCommand;
        }
    }

    onKeyUp(evt){
        switch(evt.keyCode){
            case 13:
                // key entered was 'ENTER' so time to send the code
                this.submitCommand();
                break;

            case 38:
                // key entered was "UP ARROW" so show last command
                this.displayPrevCommand();
                break;

            case 40:
                // key entered was "DOWN ARROW" so show next command 
                this.displayNextCommand();
                break;

            default:
                break;
        }
        // keyboard input 
        if(evt.keyCode === 13){
            
        }
        else if(evt.keyCode === 38){
            
        }
    }

    render(){
        return (
            <div>
                <div className="consoleIcons">
                    <button className="btn btn-link btn-clear" onClick={() => GhciDispatcher.clear()} title="Clear GHCi">
                        <FontAwesomeIcon icon={faBroom}/>
                    </button>
                </div>
                <textarea
                    ref={this.consoleRef}
                    className="ghci-console"
                    readOnly
                />
                <input
                    ref={this.inputRef}
                    className="ghci-input"
                    onKeyUp={this.onKeyUp.bind(this)}
                />
            </div>
        )
    }
}