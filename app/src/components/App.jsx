import React from "react";
import { Row, Col, Container } from "reactstrap";
import SplitPane from 'react-split-pane';
import Mousetrap from 'mousetrap';
import { FileList } from "./FileList";
import { GhciConsole } from "./GhciConsole";
import { Editor } from './Editor';
import { ModalCreateFile } from "./ModalCreateFile";
import { ModalSaveFileAs } from "./ModalSaveFileAs";
import { ModalAlert } from "./ModalAlert";
import { ModalEasterEgg } from './ModalEasterEgg';
import { VersionAPI } from "../utils/VersionAPI";
import { MenuBar } from "./MenuBar";
import ModalDispatcher from "../dispatchers/ModalDispatcher";
import IpcRequester from '../utils/IpcRequester';
import { inject, observer } from 'mobx-react';
import { ModalCreateRoom } from "./ModalCreateRoom";
import { ModalJoinRoom } from "./ModalJoinRoom";
import { EditorIconBar } from './EditorIconBar';
import { settingsStore } from "../stores/SettingsStore"
import { editorStore } from "../stores/EditorStore";
import { terminalStore } from '../stores/TerminalStore';
import { fileStore } from '../stores/FileStore';
import { windowStore } from '../stores/WindowStore';
import FileDispatcher from "../dispatchers/FileDispatcher";
import { RoomContainer } from "./RoomContainer";

import "./App.css";

export const VERSION = "0.1.1"; // remove hard coding in future

export const App = inject("editorStore", "windowStore")(observer(class App extends React.Component{
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
            windowSize: window.innerWidth,
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

        Mousetrap.bind('up up down down left right left right b a enter', () => { 
            console.log("KONAMI");
            Object.assign(
                this.props.windowStore.sessionWindowStore,
                { modalEasterEggOpen: !this.props.windowStore.sessionWindowStore.modalEasterEggOpen }
            );
        });

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
        
        IpcRequester.on("folder-data-get", ({lastFilePath}) => {
            FileDispatcher.readFile(lastFilePath);
        });
        IpcRequester.getFolderData();
    }

    componentWillUnmount(){
        IpcRequester.removeListener("settings-get", evt => {});
        settingsStore.cleanUp();
        editorStore.cleanUp();
        terminalStore.cleanUp();
        fileStore.cleanUp();
        windowStore.cleanUp();
        Mousetrap.unbind('up up down down left right left right b a enter');

    }

    render(){
        let toggleFile = this.props.windowStore.windowSettings.hideFile;
        let toggleGHCI = this.props.windowStore.windowSettings.hideGHCI;
        console.log("File list render toggle: "+toggleFile);
        return (
            <>
                <div className="iconbar-container">
                    <MenuBar/>
                    <EditorIconBar/>
                </div>
                <div className="three-cols">
                    <Container>
                        <Row>
                            <SplitPane 
                                split="vertical" 
                                minSize={175} 
                                size={toggleFile ? 0 : this.state.setFileColWidth} 
                                onDragFinished={size => {this.setState({currentFileColWidth: size})}}
                            >
                                <Col className="sidebar-panel">
                                    <FileList/>
                                </Col> 
                                <div>
                                    <SplitPane 
                                        split="vertical" 
                                        minSize={375} 
                                        size={toggleFile ? window.innerWidth : this.state.setEdColWidth }
                                        onDragFinished={size => {console.log(size); this.setState({currentEdColWidth: size})}}
                                    >
                                        <Col className="editor-panel">
                                            <Editor editorSettings={this.state.settings ? this.state.settings.editorSettings : null}/> 
                                        </Col>
                                            <Col className="ghci-panel" hidden={toggleGHCI}>
                                                <GhciConsole/>
                                                <RoomContainer/>
                                                {/* RoomContainer does not appear when outside this <Col>....? */}
                                            </Col>
                                            <div></div>
                                    </SplitPane>
                                </div>
                            </SplitPane>
                        </Row>
                    </Container>
                </div>
                <ModalCreateFile/>
                <ModalSaveFileAs/>
                <ModalAlert/>
                <ModalCreateRoom/>
                <ModalJoinRoom/>
                <ModalEasterEgg/>
            </>
        );
    }
}));