import React from "react";
import GhciDispatcher, { GHCI } from "../dispatchers/GhciDispatcher";
import "./GhciConsole.css";

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
            elem.value += "\n" + text;
            // scroll to bottom
            elem.scrollTop = elem.scrollHeight;
        }
    }

    componentDidMount(){
        // listen for ghci text
        GhciDispatcher.on(GHCI, this.handleGhci);

        GhciDispatcher.init();

        // default input (for testing)
        //this.inputRef.current.value = "x = [1,2,3,4,5]; z = filter (>3) x; show z";
    }

    componentWillUnmount(){
        // stop listening for ghci text
        GhciDispatcher.removeListener(GHCI, this.handleGhci);
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