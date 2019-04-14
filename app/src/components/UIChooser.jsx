import React from 'react';
import { observer, inject } from 'mobx-react';
import { action, intercept } from 'mobx';

export const UIChooser = inject("windowStore") (observer ( class UIChooser extends React.Component {
    selectUI = event => {
        if(event.target.value == 'theme--light'){
            this.props.windowStore.windowSettings.theme = "Light";
        } else {
            this.props.windowStore.windowSettings.theme = "Dark";
        }
    }

    componentDidUpdate(){
        if(this.props.windowStore.windowSettings.theme === "Dark"){
            document.body.classList.add('theme--dark');
            document.body.classList.remove('theme--light');
        }
        else{
            document.body.classList.remove('theme--dark');
            document.body.classList.add('theme--light');
        }
    }


    render() {
        let theme = this.props.windowStore.windowSettings.theme; // light or dark
        let val = `theme--${theme}`;

        return(
            <div className="icon-bar-chooser">
                <select name="ui-chooser" value={val} onChange={this.selectUI}>
                    <option value="theme--dark">Dark</option>
                    <option value="theme--light">Light</option>
                </select>
            </div>
        )
    }
}));