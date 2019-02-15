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
            <div class="container">
                <div class="row">
                    <div class="col">
                    Column 1
                    </div>
                    <div class="col-6">
                        <div>
                            Column 2
                            <br></br>
                            Hey, it works.
                            <br></br>
                            Can you see me? If so, you've got FontAwesome Pro! <FontAwesomeIcon size="lg" icon={faAcorn}></FontAwesomeIcon>
                            <br></br>
                            This is from a different FontAwesome icon library! <FontAwesomeIcon size="lg" icon={faApple}></FontAwesomeIcon>
                        </div>
                    </div>
                    <div class="col">
                    Column 3
                    </div>
                </div>
            </div>
        );
    }
}