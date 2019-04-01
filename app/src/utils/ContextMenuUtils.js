import ModalDispatcher from "../dispatchers/ModalDispatcher";
import FolderDispatcher from "../dispatchers/FolderDispatcher";
import { SelectFileFolder } from "./SelectFileFolder";

const contextMenu = window.require("electron-context-menu");

export const FILE_PANEL_CSS_CLASS = "sidebar-panel",
    FILE_LIST_CSS_CLASS = "file-list-folder-container"

export class ContextMenuUtils{
    // determines if current element or any parent element is a folder list folder 
    // @param           starting element to check
    static elementHasFileList(elem){
        return ContextMenuUtils.checkForCSSClass(elem, FILE_LIST_CSS_CLASS);
    };

    // determines if current element or any parent element is in the file system colun
    // @param           starting element to check
    static elementIsFileSystem(elem){
        return ContextMenuUtils.checkForCSSClass(elem, FILE_PANEL_CSS_CLASS);
    }

    // determines if current element or any parent has a css class
    // @param elem      starting element
    // @param cssClass  css class to find
    static checkForCSSClass(elem, cssClass){
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

    // determines the specified html attribute of the context triggering element
    // searches up the DOM to find the first element with the attribute 
    // @param x         x pixel coordinate of element
    // @param y         y pixel coordinate of element
    // @param attrKey   html attribute key 
    // @param callback  resolves the (element, attrKey)
    static findElementKeyAt(x, y, attrKey, callback){
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

    // uses the context menu library to create a dynamic/custom context menu
    static setupContextMenu(){
        contextMenu({
            prepend: (params, windowParams) => {
                // element clicked
                let elem = document.elementFromPoint(params.x, params.y);        
        
                // default menu addons
                let prepends = [];
        
                // file system column addons (clicked anywhere in left column)
                if(ContextMenuUtils.elementIsFileSystem(elem)){
                    prepends = [...prepends, {
                        label: "Add New File",
                        click: () => SelectFileFolder.selectFile()
                    },
                    {
                        label: "Add New Folder",
                        click: () => SelectFileFolder.selectFolder()
                    }];
                }
                
                // folder-only addons (clicked a folder list in the left column)
                if(ContextMenuUtils.elementHasFileList(elem)){
                    prepends = [...prepends, {
                        label: "Create New File",
                        click: () => {
                            // find 'folderPath' attribute of element at (x, y)
                            ContextMenuUtils.findElementKeyAt(params.x, params.y, "folder-path", (elem, folderPath) => {
                                if(folderPath){
                                    ModalDispatcher.createFileModal(folderPath);
                                }
                            });
                        }
                    },
                    {
                        label: "Remove Folder",
                        click: () => {
                            // find 'folderPath' attribute of element at (x, y)
                            ContextMenuUtils.findElementKeyAt(params.x, params.y, "folder-path", (elem, folderPath) => {
                                if(folderPath){
                                    FolderDispatcher.removeFolder(folderPath);
                                }
                            });
                        }
                    }];
                }
        
                return prepends;
            },
            showInspectElement: false
        });
        
    }
}