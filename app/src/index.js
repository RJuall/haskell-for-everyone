import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App";
import ModalDispatcher from "./dispatchers/ModalDispatcher";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

// import context menu
const contextMenu = window.require("electron-context-menu");

// setup context menu
contextMenu({
    prepend: (params, window) => [
        {
            label: "Add New File",
            click: () => ModalDispatcher.selectFolderModal()
        },
        {
            label: "Remove Folder",
            click: () => ModalDispatcher.selectFolderModal()
        }
    ],
    showInspectElement: false
})

// render app 
ReactDOM.render(<App/>, document.querySelector("#root"));