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

        this.findVal = React.createRef();
        this.replaceVal = React.createRef();
        this.handleFindChange = this.handleFindChange.bind(this);
       // this.handleReplaceChange = this.handleReplaceChange.bind(this);
    }

    closeSearch(){
        Object.assign(this.props.windowStore.windowSettings,{showSearch: false});
    }

    handleFindChange(evt){
        this.findVal = evt.target.value;
    }

    // handleReplaceChange(evt){
    //     this.replaceVal = evt.target.value;
    // }

    render() {
        return(
            <>
            <Form inline className="mt-2 mb-2">
                <FormGroup>
                    <Label for="find" className="sr-only">Find</Label>
                    <Input className="form-control-sm form-control" type="text" name="find" id="find" placeholder="Find" onChange={this.handleFindChange}/>
                </FormGroup>
                <Button className="btn btn-sm ml-2" onClick={() => EditorDispatcher.find(this.findVal,"Next")}>Next</Button>
                <Button className="btn btn-sm ml-2" onClick={() => EditorDispatcher.find(this.findVal,"Previous")}>Previous</Button>
            </Form>
            <button className="escButton" onClick={() => this.closeSearch()}>&#10005;</button>
            <Form inline className="mb-2">
                <FormGroup>
                    <Label for="replace" className="sr-only">Replace</Label>
                    <Input className="form-control-sm form-control" type="text" name="replace" id="replace" placeholder="Replace" onChange={this.handleReplaceChange}/>
                </FormGroup>
                <Button className="btn btn-sm ml-2" onClick={() => EditorDispatcher.replace(this.replaceVal, "one")}>Replace</Button>
                <Button className="btn btn-sm ml-2" onClick={() => EditorDispatcher.replace(this.replaceVal, "all")}>Replace All</Button>
            </Form>
            </>
        );
    }
}));