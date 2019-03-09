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
                <select name="theme-chooser" value={this.state.value}>
                
                </select>
            </div>
        )
    }
}