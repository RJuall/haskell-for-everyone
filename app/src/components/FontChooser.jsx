import React from 'react';
import { observer, inject} from 'mobx-react';
import { action } from 'mobx';

export const FontChooser = inject("editorStore")(observer( class FontChooser extends React.Component {
    constructor(props) {
        super(props);

        // sets the font family state and emits
        //    a font change event
        action(
            this.fontChange = event => {
                this.props.editorStore.editorSettings.fontFamily = event.target.value;
            }
        )
    }    

    render() {
        return(
            <div className="icon-bar-chooser">
                <select name="font-chooser" value={this.props.editorStore.editorSettings.fontFamily} onChange={this.fontChange}>
                    <option value="Inconsolata">Inconsolata</option>
                    <option value="Roboto Mono">Roboto Mono</option>
                    <option value="Source Code Pro">Source Code Pro</option>
                    <option value="VT323">VT323</option>
                    <option value="Ubuntu Mono">Ubuntu Mono</option>
                    <option value="PT Mono">PT Mono</option>
                    <option value="Cousine">Cousine</option>
                    <option value="B612">B612 Mono</option>
                    <option value="Nanum Gothic Coding">Nanum Gothic Coding</option>
                    <option value="Space Mono">Space Mono</option>
                    <option value="Share Tech Mono">Share Tech Mono</option>
                    <option value="IBM Plex Mono">IBM Plex Mono</option>
                    <option value="Fira Mono">Fira Mono</option>
                    <option value="Anonymous Pro">Anonymous Pro</option>
                    <option value="Cutive Mono">Cutive Mono</option>
                    <option value="Oxygen Mono">Oxygen Mono</option>
                    <option value="Overpass Mono">Overpass Mono</option>
                    <option value="Nova Mono">Nova Mono</option>
                </select>
            </div>
        )
    }
}));