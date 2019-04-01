import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'mobx-react';
import { App } from "./components/App";
import { settingsStore } from './stores/SettingsStore';
import { editorStore } from './stores/EditorStore';
import { terminalStore } from './stores/TerminalStore';
import { fileStore } from './stores/FileStore';
import { windowStore } from './stores/WindowStore';
import FolderDispatcher from "./dispatchers/FolderDispatcher";
import ModalDispatcher from "./dispatchers/ModalDispatcher";
import { ContextMenuUtils } from "./utils/ContextMenuUtils";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

// setup context menu
ContextMenuUtils.setupContextMenu();

// render app 
ReactDOM.render(
    <Provider settingsStore={settingsStore}
              editorStore={editorStore}
              terminalStore={terminalStore}
              fileStore={fileStore}
              windowStore={windowStore}>
        <App/>   
    </Provider>, 
    document.querySelector("#root"));