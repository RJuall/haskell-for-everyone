import React from "react";
import { Button, Container, Card, CardBody } from "reactstrap";
import ModalDispatcher from "../dispatchers/ModalDispatcher";

export class RoomSetup extends React.Component{
    render(){
        return (
            <Container className="room-empty-container">
                <br/>
                <div className="room-name text-center">
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
                </div>
                <br/>
            </Container>
        )
    }
}