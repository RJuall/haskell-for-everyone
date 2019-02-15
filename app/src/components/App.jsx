import React from "react";
import { faAcorn } from '@fortawesome/pro-regular-svg-icons';
import { faApple } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {

        };
    }

    render(){
        return (
            <div>
                Hey, it works.
                <br></br>
                Can you see me? If so, you've got FontAwesome Pro! <FontAwesomeIcon size="lg" icon={faAcorn}></FontAwesomeIcon>
                <br></br>
                This is from a different FontAwesome icon library! <FontAwesomeIcon size="lg" icon={faApple}></FontAwesomeIcon>
            </div>
        );
    }
}