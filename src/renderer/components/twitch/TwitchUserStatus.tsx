
import * as React from "react";

import { Button, Card, Image } from "semantic-ui-react";

import defaultUserImage from "@/styles/images/user.svg";

export const TwitchUserStatus: React.SFC<{
    displayName: string;
    channel: string;
    image?: any;
    onSignOut: () => void;
}> = props => {
    const userImage = props.image ? props.image : defaultUserImage;
    const url = `twitch.tv/${props.channel}`;
    return (
        <div style={{padding: "3px"}}>
            <Card>
                <Card.Content>
                    <Image
                        floated="right"
                        size="mini"
                        src={userImage}
                    />
                    <Card.Header>{props.displayName}</Card.Header>
                    <Card.Meta><a href={`https://${url}`} target="_blank">{url}</a></Card.Meta>
                </Card.Content>
                <Card.Content extra>
                    <Button basic fluid color="red" onClick={props.onSignOut}>
                        Sign out
                </Button>
                </Card.Content>
            </Card>
        </div>
    );
};
