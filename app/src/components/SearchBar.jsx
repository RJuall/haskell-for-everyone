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
            inputValue : "",
        };

        this.searchInput = React.createRef();
    }

    closeSearch(){
        Object.assign(this.props.windowStore.windowSettings,{showSearch: false});
    }

    render() {
        // file name to display 
        let fileName = (this.props.fileStore.fileSettings.lastFilePath || "").split("/").pop();

        return(
            <>
            <Form inline className="mt-2 mb-2">
                <FormGroup>
                    <Label for="find" className="sr-only">Find</Label>
                    <Input className="form-control-sm form-control" type="text" name="find" id="find" placeholder="Find" />
                </FormGroup>
                <Button className="btn btn-sm ml-2" onClick={() => EditorDispatcher.find(this.searchInput.current.value)} value={this.state.inputValue}>Find</Button>
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