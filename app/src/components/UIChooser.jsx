import React from 'react';
import { observer, inject } from 'mobx-react';
import { action, intercept } from 'mobx';

export const UIChooser = inject("windowStore") (observer ( class UIChooser extends React.Component {
    constructor(props) {
        super(props);

        this.selectRef = React.createRef();

        this.state = {
            value: 'theme--dark'
        };

        this.selectUI = event => {
            this.setState({value: event.target.value});
            if(event.target.value == 'theme--light'){
                document.body.classList.remove('theme--dark');
                document.body.classList.add('theme--light');
                Object.assign(this.props.windowStore.windowSettings, {theme: "light"});
                console.log(this.props.windowStore.windowSettings.theme);
            } else {
                document.body.classList.add('theme--dark');
                document.body.classList.remove('theme--light');
                Object.assign(this.props.windowStore.windowSettings, {theme: "dark"});
                console.log(this.props.windowStore.windowSettings.theme);
            }
        }
    }

    componentDidMount(){
        // listen for theme change 
        intercept(this.props.windowStore.windowSettings, "theme", change => {
            // update <select>
            let index = this.selectRef.current.selectedIndex;
            this.selectRef.current.selectedIndex = index === 0 ? 1 : 0;
        });
    }

    render() {
        return(
            <div className="icon-bar-chooser">
                <select ref={this.selectRef} name="ui-chooser" value={this.state.value} onChange={this.selectUI}>
                    <option value="theme--dark">Dark</option>
                    <option value="theme--light">Light</option>
                </select>
            </div>
        )
    }
}));