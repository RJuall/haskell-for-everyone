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
    prepend: (params, window) => {
        // element clicked
        let elem = document.elementFromPoint(params.x, params.y);        

        // default menu
        let prepends = [];

        // file system column addons
        if(elementIsFileSystem(elem)){
            prepends = [...prepends, {
                label: "Add New File",
                click: () => ModalDispatcher.selectFileModal()
            },
            {
                label: "Add New Folder",
                click: () => ModalDispatcher.selectFolderModal()
            }];
        }
        
        // folder-only addons
        if(elementHasFileList(elem)){
            prepends.push({
                label: "Remove Folder",
                click: () => {
                    // find 'folderPath' attribute of element at (x, y)
                    findElementKeyAt(params.x, params.y, "folderPath", (elem, folderPath) => {
                        if(folderPath){
                            FolderDispatcher.removeFolder(folderPath);
                        }
                    });
                }
            });
        }

        return prepends;
    },
    showInspectElement: false
});

// determines the specified html attribute of the context triggering element
// searches up the DOM to find the first element with the attribute 
// @param x         x pixel coordinate of element
// @param y         y pixel coordinate of element
// @param attrKey   html attribute key 
// @param callback  resolves the (element, attrKey)
let findElementKeyAt = (x, y, attrKey, callback) => {
    let elem = document.elementFromPoint(x, y);
    let value = null;

    if(elem){
        do{
            if(elem.getAttribute(attrKey)){
                value = elem.getAttribute(attrKey);
                break;
            }
            else{
                elem = elem.parentNode;
            } 
        } while(elem.parentNode);
    }
    
    callback(value ? elem : null, value);
};

// determines if current element or any parent element is a folder list folder 
// @param           starting element to check
let elementHasFileList = elem => {
    return checkForCSSClass(elem, "file-list-folder-container");
};

// determines if current element or any parent element is in the file system colun
// @param           starting element to check
let elementIsFileSystem = elem => {
    return checkForCSSClass(elem, "sidebar-panel");
}

// determines if current element or any parent has a css class
// @param elem      starting element
// @param cssClass  css class to find
let checkForCSSClass = (elem, cssClass) => {
    do{
        if(elem.classList.contains(cssClass)){
            return true;
        }
        else{
            elem = elem.parentNode;
        }
    } while(elem.parentNode);

    return false;
}

// render app 
ReactDOM.render(<App/>, document.querySelector("#root"));