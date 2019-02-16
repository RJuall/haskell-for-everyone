import React from "react";
import { Row, Col, Container } from "reactstrap";
import { faAcorn } from '@fortawesome/pro-regular-svg-icons';
import { faApple } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SplitPane from 'react-split-pane';
import { FileList } from "./FileList";
import './app.css';

export class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {

        };
    }

    render(){
        return (
            <Container>
                <Row>
                    <SplitPane split="vertical" minSize={50} defaultSize={300}>
                        <Col>
                          Col1
                          <FileList/>
                        </Col>
                        <div>
                            <SplitPane split="vertical" minSize={50} defaultSize={300}>
                            <Col>
                                Column 2
                                <br></br>
                                Hey, it works.
                                <br></br>
                                Can you see me? If so, you've got FontAwesome Pro! <FontAwesomeIcon size="lg" icon={faAcorn}></FontAwesomeIcon>
                                <br></br>
                                This is from a different FontAwesome icon library! <FontAwesomeIcon size="lg" icon={faApple}></FontAwesomeIcon>
                            </Col>
                            <Col>
                              Col3
                            </Col>
                            </SplitPane>
                        </div>
                    </SplitPane>
                </Row>
            </Container>
        );
    }
}