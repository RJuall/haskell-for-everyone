import React from "react";
import GhciDispatcher, { GHCI, GHCI_ERROR, GHCI_CLEAR } from "../dispatchers/GhciDispatcher";
import ModalDispatcher from "../dispatchers/ModalDispatcher";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./GhciConsole.css";
import { faBroom } from "@fortawesome/pro-regular-svg-icons";

export class GhciConsole extends React.Component{
    constructor(props){
        super(props);

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

    onKeyUp(evt){
        // keyboard input 
        if(evt.keyCode === 13){
            // key entered was 'ENTER' so time to send the code
            let elem = this.inputRef.current;   // input element ref
            let code = elem.value.trim();       // code in element

            // only send if there is actual code (aka user is not spamming enter)
            if(code.length){
                // clear the input element
                elem.value = "";
                // send the code 
                GhciDispatcher.executeCode(code);
            }
        }
    }

    render(){
        return (
            <div>
                <div className="consoleIcons">
                    <button className="clear" onClick={() => GhciDispatcher.clear()}><FontAwesomeIcon size="2x" icon={faBroom}/></button>
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