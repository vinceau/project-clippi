import * as React from "react";

import { Button, Card, Icon, Image } from "semantic-ui-react";
import styled from "styled-components";

import { shell } from "electron";
import { createTwitchClip } from "../../../common/twitch";
import { notify } from "../../lib/utils";
import defaultUserImage from "../../styles/images/user.svg";

export const TwitchUserStatus: React.SFC<{
    displayName: string;
    channel: string;
    image?: any;
    onSignOut: () => void;
}> = props => {
    const userImage = props.image ? props.image : defaultUserImage;
    const StatusContainer = styled.div`
    padding: 3px;
    `;
    const url = `twitch.tv/${props.channel}`;
    return (
        <StatusContainer>
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
        </StatusContainer>
    );
};

export const TwitchClip: React.SFC<{ accessToken: string }> = props => {
    const [name, setName] = React.useState("");
    const delay = false;
    const handleClip = () => {
        createTwitchClip(props.accessToken, delay, name).then(clip => {
            console.log(`clip: ${clip}`);
            notify(`Created Twitch clip: ${clip}`);
        }).catch((err) => {
            console.error(err);
            notify(`Failed to create Twitch clip. Are you sure ${name ? `${name} is` : "you are"} live?`);
        });
    };

    return (
        <div>
            <form>
                <label>
                    Twitch broadcaster ID:
                    <input type="text" value={name} onChange={e => setName(e.target.value)} />
                </label>
                <button
                    onClick={(e: any) => {
                        e.preventDefault();
                        handleClip();
                    }}
                >
                    clip
                </button>
            </form>
        </div>
    );
};

export const TwitchConnectButton: React.FC<{
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}> = (props) => {
    const twitchColor = "#6441A4";
    const ButtonText = styled.span`
    margin-left: 5px;
    font-size: 14px;
    `;
    const TwitchButton = styled.button`
    color: white;
    background-color: ${twitchColor};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 220px;
    border: 0;
    border-radius: 3px;
    padding: 5px 0;
    i.icon {
        font-size: 25px;
        margin: 5px 0;
    }
    `;
    return (
        <TwitchButton onClick={props.onClick}>
            <Icon name="twitch" />
            <ButtonText>Connect with Twitch</ButtonText>
        </TwitchButton>
    );
};
