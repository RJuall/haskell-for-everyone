import React from 'react';

export class UIChooser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'theme--dark'
        };

        this.selectUI = event => {
            this.setState({value: event.target.value});
            if(event.target.value == 'theme--light'){
                document.body.classList.remove('theme--dark');
                document.body.classList.add('theme--light');
            } else {
                document.body.classList.add('theme--dark');
                document.body.classList.remove('theme--light');
            }
        }
    }

    render() {
        return(
            <div className="icon-bar-chooser">
                <select name="ui-chooser" value={this.state.value} onChange={this.selectUI}>
                    <option value="theme--dark">Dark</option>
                    <option value="theme--light">Light</option>
                </select>
            </div>
        )
    }
}