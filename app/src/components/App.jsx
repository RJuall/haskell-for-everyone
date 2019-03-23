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
import IpcRequester from '../utils/IpcRequester';
import { ModalCreateRoom } from "./ModalCreateRoom";
import { ModalJoinRoom } from "./ModalJoinRoom";
import { ModalSelectFile } from "./ModalSelectFile";
import "./App.css";

export const VERSION = "0.1.0"; // remove hard coding in future

export class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            settings: null,
            fileColSize: (window.innerWidth * 0.15),
            edColSize: (window.innerWidth * 0.6)
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
        IpcRequester.on("settings-get", evt => this.settings = evt.settings);
        IpcRequester.getSettings();

        window.onresize = () => {
            console.log(window.innerWidth);
        } 
    }

    componentWillMount(){
        IpcRequester.removeListener("settings-get", evt => {});
    }

    render(){
        return (
            <>
                <MenuBar/>
                <Container>
                    <Row>
                        <SplitPane split="vertical" minSize={175} defaultSize={this.state.fileColSize}>
                            <Col className="sidebar-panel">
                                <FileList/>
                            </Col>
                            <div>
                                <SplitPane split="vertical" minSize={375} defaultSize={this.state.edColSize}>
                                <Col className="editor-panel">
                                    <Editor editorSettings={this.state.settings ? this.state.settings.editorSettings : null}/>
                                </Col>
                                <Col className="ghci-panel">
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
                <ModalCreateRoom/>
                <ModalJoinRoom/>
            </>
        );
    }
}