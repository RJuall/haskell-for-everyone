import React from 'react';
import EditorDispatcher from '../dispatchers/EditorDispatcher';
import FileDispatcher, { FILE_READ } from '../dispatchers/FileDispatcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import "./SearchBar.css";

export const SearchBar = inject("editorStore", "fileStore","windowStore")(observer(class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            //findVal : "",
            replaceVal : ""
        };

        this.findVal = React.createRef();
        this.handleChange = this.handleChange.bind(this);
    }

    closeSearch(){
        Object.assign(this.props.windowStore.windowSettings,{showSearch: false});
    }

    handleChange(evt){
        //this.setState({findVal : evt.target.value});
        this.findVal = evt.target.value;
    }

    render() {
        return(
            <>
            <Form inline className="mt-2 mb-2">
                <FormGroup>
                    <Label for="find" className="sr-only">Find</Label>
                    <Input className="form-control-sm form-control" type="text" name="find" id="find" placeholder="Find" value={this.state.findVal} onChange={this.handleChange}/>
                </FormGroup>
                <Button className="btn btn-sm ml-2" onClick={() => EditorDispatcher.find(this.findVal,"Next")}>Next</Button>
                <Button className="btn btn-sm ml-2" onClick={() => EditorDispatcher.find(this.findVal,"Previous")}>Previous</Button>
            </Form>
            <button className="escButton" onClick={() => this.closeSearch()}>&#10005;</button>
            <Form inline className="mb-2">
                <FormGroup>
                    <Label for="replace" className="sr-only">Replace</Label>
                    <Input className="form-control-sm form-control" type="text" name="replace" id="replace" placeholder="Replace" />
                </FormGroup>
                <Button className="btn btn-sm ml-2">Replace</Button>
            </Form>
            </>
        );
    }
}));