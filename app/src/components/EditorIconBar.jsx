import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/pro-regular-svg-icons';

import './EditorIconBar.css';

class EditorIconBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return(
            <div class="icon-bar">
                <button><FontAwesomeIcon size="2x" icon={faSave}/></button>
                <button></button>
                <button></button>
            </div>
        );
    }
}

export default EditorIconBar;