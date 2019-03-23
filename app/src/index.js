import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App";
import ModalDispatcher from "./dispatchers/ModalDispatcher";
import FolderDispatcher from "./dispatchers/FolderDispatcher";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

// import context menu
const contextMenu = window.require("electron-context-menu");

// setup context menu
contextMenu({
    prepend: (params, window) => [
        {
            label: "Add New File",
            click: () => ModalDispatcher.selectFileModal()
        },
        {
            label: "Add New Folder",
            click: () => ModalDispatcher.selectFolderModal()
        },
        {
            label: "Remove Folder",
            click: () => {
                // find 'folderPath' attribute of element at (x, y)
                let folderPath = findElementKeyAt(params.x, params.y, "folderPath");
                // null = not found
                if(folderPath){
                    FolderDispatcher.removeFolder(folderPath);
                }
            }
        }
    ],
    showInspectElement: false
});

// determines the specified html attribute of the context triggering element
// @param x         x pixel coordinate of element
// @param y         y pixel coordinate of element
// @param attrKey   html attribute key 
let findElementKeyAt = (x, y, attrKey) => {
    let elem = document.elementFromPoint(x, y);

    if(elem){
        do{
            if(elem.getAttribute(attrKey)){
                return elem.getAttribute(attrKey);
            }
            else{
                elem = elem.parentNode;
            } 
        } while(elem.parentNode);
    }
    return null;
};

// render app 
ReactDOM.render(<App/>, document.querySelector("#root"));