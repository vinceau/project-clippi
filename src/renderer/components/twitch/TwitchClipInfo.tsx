import React from "react";

import { TwitchClip } from "common/types";
import { device } from "@/styles/device";
import { transparentize } from "polished";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";

import { format } from "timeago.js";
import { Labelled } from "../Labelled";

const ClipContainer = styled.div`
border: solid 1px ${({ theme }) => theme.background3}
border-radius: 3px;
margin-bottom: 5px;
padding: 10px;
display: flex;
justify-content: space-between;
flex-direction: column;
@media ${device.tablet} {
    flex-direction: row;
}
background-color: ${({ theme }) => transparentize(0.3, theme.foreground3)};
a {
    color: ${({ theme }) => theme.foreground}

}
h2 {
    word-break: break-all;
    font-size: 18px;
    margin: 0;
    margin-bottom: 5px;
}
`;

const ButtonsContainer = styled.div`
display: flex;
align-self: flex-end;
font-size: 20px;

@media ${device.tablet} {
    align-self: center;
}
& > span {
    padding: 5px;
}
`;

export const TwitchClipInfo: React.FC<{
    clip: TwitchClip,
    onRemove?: (clipID: string) => void,
}> = (props) => {
    const timestamp = format(props.clip.timestamp);
    const url = `https://clips.twitch.tv/${props.clip.clipID}`;
    const onRemove = () => {
        if (props.onRemove) {
            props.onRemove(props.clip.clipID);
        }
    };
    const channelUrl = props.clip.channel ? `https://twitch.tv/${props.clip.channel}` : undefined;
    return (
        <ClipContainer>
            <div>
                <Labelled title="Show clip in browser"><a href={url} target="_blank"><h2>{props.clip.clipID}</h2></a></Labelled>
                <div>{props.clip.channel && <span>
                    <Labelled title="Go to Twitch channel">
                        <a href={channelUrl} target="_blank">{props.clip.channel}</a>
                    </Labelled> {" | "}
                </span>} {timestamp}</div>
            </div>
            <ButtonsContainer>
                <Labelled title="Edit"><a href={url + "/edit"} target="_blank"><Icon name="pencil" /></a></Labelled>
                <Labelled title="Remove"><Icon name="trash" onClick={onRemove} /></Labelled>
            </ButtonsContainer>
        </ClipContainer>
    );
};
