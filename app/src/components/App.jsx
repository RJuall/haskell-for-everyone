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
import { settingsStore } from "../utils/SettingsStore"
import "./App.css";

export const VERSION = "0.1.0"; // remove hard coding in future

export class App extends React.Component{
    constructor(props){
        super(props);

        let initialFileColWidth = (window.innerWidth * 0.15);
        let initialEdColWidth = (window.innerWidth * 0.6);

        this.state = {
            settings: null,
            setFileColWidth: initialFileColWidth,
            setEdColWidth: initialEdColWidth,
            currentFileColWidth: initialFileColWidth,
            currentEdColWidth: initialEdColWidth,
            windowSize: window.innerWidth
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
            let newWindowWidth = window.innerWidth;
            let oldFileColRatio = this.state.currentFileColWidth / this.state.windowSize;
            let oldEdColRatio = this.state.currentEdColWidth / this.state.windowSize;
            let newFileColWidth = newWindowWidth * oldFileColRatio;
            let newEdColWidth = newWindowWidth * oldEdColRatio;

            this.setState({setFileColWidth: newFileColWidth, 
                           setEdColWidth: newEdColWidth,
                           currentFileColWidth: newFileColWidth,
                           currentEdColWidth: newEdColWidth,
                           windowSize: newWindowWidth
                        });
        } 
    }

    componentWillUnmount(){
        IpcRequester.removeListener("settings-get", evt => {});
        settingsStore.cleanUp();
    }

    render(){
        return (
            <>
git                 <MenuBar/>
                <Container>
                    <Row>
                        <SplitPane 
                            split="vertical" 
                            minSize={175} 
                            size={this.state.setFileColWidth} 
                            onDragFinished={size => {this.setState({currentFileColWidth: size})}}
                        >
                                <Col className="sidebar-panel">
                                    <FileList/>
                                </Col>
                            <div>
                                <SplitPane 
                                    split="vertical" 
                                    minSize={375} 
                                    size={this.state.setEdColWidth}
                                    onDragFinished={size => {console.log(size); this.setState({currentEdColWidth: size})}}
                                >
                                    <Col className="editor-panel">
                                        <Editor editorSettings={this.state.settings ? this.state.settings.editorSettings : null}/>
                                    </Col>
                                    {/* <SplitPane
                                        split="horizontal"
                                        size={500}
                                    > */}
                                        <Col className="ghci-panel">
                                            <GhciConsole/>
                                        </Col>
                                        <div></div>
                                    {/*</SplitPane>*/}
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