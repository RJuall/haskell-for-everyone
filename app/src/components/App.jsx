import React from "react";
import { Row, Col, Container } from "reactstrap";
import SplitPane from 'react-split-pane';
import { FileList } from "./FileList";
import { GhciConsole } from "./GhciConsole";
import { Editor } from './Editor';
import { ModalCreateFile } from "./ModalCreateFile";
import { ModalSaveFileAs } from "./ModalSaveFileAs";
import { ModalAlert } from "./ModalAlert";
import "./App.css";

export class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {

        };
    }

    render(){
        return (
            <>
                <Container>
                    <Row>
                        <SplitPane split="vertical" minSize={100} defaultSize={150}>
                            <Col>
                                <FileList/>
                            </Col>
                            <div>
                                <SplitPane split="vertical" minSize={200} defaultSize={1100}>
                                <Col>
                                    <Editor/>
                                </Col>
                                <Col>
                                GHCi
                                <GhciConsole/>
                                </Col>
                                </SplitPane>
                            </div>
                        </SplitPane>
                    </Row>
                </Container>
                <ModalCreateFile/>
                <ModalSaveFileAs/>
                <ModalAlert/>
            </>
        );
    }
}