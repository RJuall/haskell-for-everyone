import React from 'react';
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';

export const ThemeChooser = inject("editorStore","windowStore")(observer(class ThemeChooser extends React.Component {
    constructor(props) {
        super(props);

        // sets the theme value state and emits
        //    a theme change event
        this.selectTheme = action( event => {
            this.props.editorStore.editorSettings.theme = event.target.value;
            if(this.props.editorStore.editorSettings.theme === "github" || this.props.editorStore.editorSettings.theme === "Tomorrow" || 
                this.props.editorStore.editorSettings.theme === "kuroir" || this.props.editorStore.editorSettings.theme === "xcode" ||
                this.props.editorStore.editorSettings.theme === "textmate" || this.props.editorStore.editorSettings.theme === "solarized_light" ||
                this.props.editorStore.editorSettings.theme === "eclipse"){
                    Object.assign(this.props.windowStore.windowSettings,{theme : "light"});
                }else{
                    Object.assign(this.props.windowStore.windowSettings,{theme : "dark"});
                }
        })
}

    render() {
        return(
            <div className="icon-bar-chooser">
                <select name="theme-chooser" value={this.props.editorStore.editorSettings.theme} onChange={this.selectTheme}>
                    <option value="dracula">Dracula</option>
                    <option value="github">Github</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="kuroir">Kuroir</option>
                    <option value="twilight">Twilight</option>
                    <option value="xcode">Xcode</option>
                    <option value="textmate">TextMate</option>
                    <option value="solarized_dark">Solarized Dark</option>
                    <option value="solarized_light">Solarized Light</option>
                    <option value="terminal">Terminal</option>
                    <option value="monokai">Monokai</option>
                    <option value="eclipse">Eclipse</option>
                </select>
            </div>
        )
    }
}));