import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faPlay, faMinus, faPlus, faTextHeight } from '@fortawesome/pro-regular-svg-icons';

import './EditorIconBar.css';

class EditorIconBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return(
            <div class="icon-bar">
                <button><FontAwesomeIcon size="2x" icon={faPlay}/></button>
                <button><FontAwesomeIcon size="2x" icon={faSave}/></button>
                <button></button>
                <button><FontAwesomeIcon size="2x" icon={faMinus}/></button>
                <button><FontAwesomeIcon size="2x" icon={faTextHeight}/></button>
                <button><FontAwesomeIcon size="2x" icon={faPlus}/></button>
            </div>
        );
    }
}

export default EditorIconBar;