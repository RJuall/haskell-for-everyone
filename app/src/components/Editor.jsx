import React from 'react';
import ReactAceEditor from './ReactAceEditor'
import './Editor.css';

export class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return(
            <>
            <ReactAceEditor/>
            </>
        )
    }
}