import React from "react";
import WSClient, { CHAT } from "../utils/WSClient";

export class RoomChat extends React.Component{
    constructor(props){
        super(props);

        this.chatOutRef = React.createRef();
        this.chatInRef = React.createRef();
    }

    componentDidMount(){
        this.wsCallbackId = WSClient.register(({type, data}) => {
            if(type === CHAT && !data.err){
                // extract chat info from payload
                let {chat, from} = data;

                // get element
                let textarea = this.chatOutRef.current;

                // figure out new text
                let appendText = from ? `${from}: ${chat}` : chat; 

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
            let input = this.chatInRef.current,
                chat =  input.value;

            // must have > 0 characters
            if(chat){
                // submit chat
                WSClient.sendChat(chat);

                // clear element
                input.value = "";
            }
        }
    }

    render(){
        return (
            <div className="room-chat-container">
                <br/>
                <div className="text-center">
                    {this.props.roomName}
                </div>
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