import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App";
import { ContextMenuUtils } from "./utils/ContextMenuUtils";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

// setup context menu
ContextMenuUtils.setupContextMenu();

// render app 
ReactDOM.render(<App/>, document.querySelector("#root"));