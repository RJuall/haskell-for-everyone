import React from "react";
import { Row, Col, Container } from "reactstrap";
import SplitPane from 'react-split-pane';
import { FileList } from "./FileList";
import { GhciConsole } from "./GhciConsole";
import { Editor } from './Editor';
import { ModalCreateFile } from "./ModalCreateFile";
import { ModalSaveFileAs } from "./ModalSaveFileAs";
import { ModalAlert } from "./ModalAlert";
import { VersionAPI } from "../utils/VersionAPI";
import { MenuBar } from "./MenuBar";
import ModalDispatcher from "../dispatchers/ModalDispatcher";
import { ModalSelectFile } from "./ModalSelectFile";
import "./App.css";

export const VERSION = "0.1.0"; // remove hard coding in future

export class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {

        };
    }

    checkForUpdate(){
        VersionAPI.getVersion().then(version => {
            if(version.length && version !== VERSION){
                ModalDispatcher.alertModal(
                    "Update Available",
                    "Please visit our website and download the updated Haskell For Everyone."
                );
            }
        }).catch(() => console.log("Unable to load version."));
    }

    componentDidMount(){
        this.checkForUpdate();
    }

    render(){
        return (
            <>
                <MenuBar/>
                <Container>
                    <Row>
                        <SplitPane split="vertical" minSize={100} defaultSize={150}>
                            <Col className="sidebar-panel">
                                <FileList/>
                            </Col>
                            <div>
                                <SplitPane split="vertical" minSize={200} defaultSize={1100}>
                                <Col className="editor-panel">
                                    <Editor/>
                                </Col>
                                <Col className="ghci-panel">
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
                <ModalSelectFile/>
            </>
        );
    }
}