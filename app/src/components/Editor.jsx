import React from 'react';
import './Editor.css';
import { ReactAceEditor } from './ReactAceEditor'

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