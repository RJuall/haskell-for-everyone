import React from 'react';
import EditorDispatcher from '../dispatchers/EditorDispatcher';

export class ThemeChooser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'dracula'
        };
        
        this.themeChange = event => {
            this.setState({value: event.target.value});
            EditorDispatcher.themeSet(event.target.value);
        }
    }

    render() {
        return(
            <div className="icon-bar-chooser">
                <select name="theme-chooser" value={this.state.value} onChange={themeChange}>
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
}