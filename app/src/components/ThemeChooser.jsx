import React from 'react';
import { observer, inject } from 'mobx-react';
import EditorDispatcher from '../dispatchers/EditorDispatcher';

export const ThemeChooser = inject("editorStore")(observer(class ThemeChooser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'dracula'
        };

        // sets the theme value state and emits
        //    a theme change event
        this.selectTheme = event => {
            this.props.editorStore.editorSettings.theme = event.target.value;
        }
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