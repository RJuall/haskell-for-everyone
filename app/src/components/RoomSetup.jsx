import React from "react";
import { Button, Container, Card, CardBody } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/pro-light-svg-icons";
import ModalDispatcher from "../dispatchers/ModalDispatcher";
import WSClient from "../utils/WSClient";

export class RoomSetup extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            showBtn: false
        };

        this.wsCallbackId = -1;
    }

    componentDidMount(){
        this.wsCallbackId = WSClient.register(({type, data}) => {
            if(type == "close" || type === "error"){
                this.setState({showBtn: true});
            }
            else if(type === "open"){
                this.setState({showBtn: false});
            }
        });
    }

    componentWillUnmount(){
        WSClient.unregister(this.wsCallbackId);
    }

    onReconnectClick = () => {
        // disable button and reconnect 
        this.setState({showBtn: false}, () => {
            WSClient.connect();
        });
    }

    render(){
        let {showBtn} = this.state;

        return (
            <Container className="room-empty-container">
                <br/>
                <div className="text-center">
                    Online Rooms
                </div>
                <br/>
                <div className="room-cards">
                    <Card color="dark">
                        <CardBody>
                            <p>You can search for online rooms to join.</p>
                            <div className="text-center">
                                <Button onClick={() => ModalDispatcher.joinRoomModal()}>
                                    Join
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                    <br/>
                    <Card color="dark">
                        <CardBody>
                            <p>You can create your own online room for people to join.</p>
                            <div className="text-center">
                                <Button onClick={() => ModalDispatcher.createRoomModal()}>
                                    Create
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
                <br/>
                <div className="text-center">
                    You are currently { this.props.isConnected ? "online" : "offline" }
                    &nbsp;
                    <span style={{cursor: "pointer"}} onClick={this.onReconnectClick} hidden={!showBtn} disabled={showBtn} title="Retry connection">
                        <FontAwesomeIcon icon={faSync}/>
                    </span> 
                </div>
                <br/>
            </Container>
        )
    }
}