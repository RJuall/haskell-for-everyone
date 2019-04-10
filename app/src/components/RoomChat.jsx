import React from "react";
import WSClient, { CHAT } from "../utils/WSClient";

export class RoomChat extends React.Component{
    constructor(props){
        super(props);

        this.chatOutRef = React.createRef();
        this.chatInRef = React.createRef();
    }

    componentDidMount(){
        this.wsCallbackId = WSClient.register(({type, chat, from, err}) => {
            if(type === CHAT && !err){
                // get element
                let textarea = this.chatOutRef.current;

                // figure out new text
                let appendText = from ? `${chat}: ${from}` : chat; 

                // append text to element 
                textarea.value += (textarea.value ? `\n${appendText}` : appendText);

                // scroll element
                // scroll to bottom
                textarea.scrollTop = textarea.scrollHeight;
            }
        });
    }

    componentWillUnmount(){
        WSClient.unregister(this.wsCallbackId);
    }

    onChatInput = evt => {
        // enter key? 
        if(evt.keyCode === 13){
            let input = this.chatInRef.current;

            // submit chat
            WSClient.sendChat(input.value);

            // clear element
            input.value = "";
        }
    }

    render(){
        return (
            <div className="room-chat-container">
                <br/>
                <textarea
                    className="room-chat-textarea"
                    ref={this.chatOutRef}
                    readOnly={true}
                />
                <br/>
                <input
                    className="room-chat-input"
                    ref={this.chatInRef}
                    onKeyUp={this.onChatInput}
                    maxLength={100}
                />
            </div>
        );
    }
}