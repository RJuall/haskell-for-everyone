import React from "react";
import { Row, Col, Container } from "reactstrap";
import { faAcorn } from '@fortawesome/pro-regular-svg-icons';
import { faApple } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FileList } from "./FileList";

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
                    <Col lg={2}>
                        <div>Column 1</div>
                        <FileList/>
                    </Col>
                    <Col lg={6}>
                        <div>
                            Column 2
                            <br></br>
                            Hey, it works.
                            <br></br>
                            Can you see me? If so, you've got FontAwesome Pro! <FontAwesomeIcon size="lg" icon={faAcorn}></FontAwesomeIcon>
                            <br></br>
                            This is from a different FontAwesome icon library! <FontAwesomeIcon size="lg" icon={faApple}></FontAwesomeIcon>
                        </div>
                    </Col>
                    <Col lg={4}>
                        Column 3
                    </Col>
                </Row>
            </Container>
        );
    }
}