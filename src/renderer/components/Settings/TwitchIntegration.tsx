import * as React from "react";

import { useDispatch, useSelector } from "react-redux";

import { Dispatch, iRootState } from "@/store";

import { TwitchClip } from "@/store/models/twitch";
import { shell } from "electron";
import { Icon, Loader, Table } from "semantic-ui-react";
import styled from "styled-components";
import { format } from "timeago.js";
import { TwitchConnectButton, TwitchUserStatus } from "../TwitchConnect";

export const ClipsTable: React.FC = props => {
    return (
        <Table celled padded>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell singleLine>Clip ID</Table.HeaderCell>
                    <Table.HeaderCell>Timestamp</Table.HeaderCell>
                    <Table.HeaderCell>Remove</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {props.children}
            </Table.Body>
        </Table>
    );
};

const ClipRow: React.FC<{
    clip: TwitchClip;
    onClick: () => void;
    onRemove: () => void;
}> = props => {
    const Clickable = styled.span`
    cursor: pointer;
    `;
    const onClick = (e: any) => {
        e.preventDefault();
        props.onClick();
    };
    return (
        <Table.Row key={props.clip.clipID}>
            <Table.Cell>
                <a href="#" onClick={onClick}>{props.clip.clipID}</a>
            </Table.Cell>
            <Table.Cell>
                {format(props.clip.timestamp * 1000)}
            </Table.Cell>
            <Table.Cell>
                <Clickable onClick={props.onRemove}><Icon name="trash" /></Clickable>
            </Table.Cell>
        </Table.Row>
    );
};

export const TwitchIntegration = () => {
    const { twitchUser } = useSelector((state: iRootState) => state.tempContainer);
    const dispatch = useDispatch<Dispatch>();
    const { authToken, clips } = useSelector((state: iRootState) => state.twitch);
    const rows: JSX.Element[] = [];
    const onClick = (clipID: string) => {
        shell.openExternal(`https://clips.twitch.tv/${clipID}`);
    };
    const allClips = Object.values(clips);
    allClips.sort((x, y) => {
        if (x.timestamp > y.timestamp) {
            return -1;
        }
        if (x.timestamp < y.timestamp) {
            return 1;
        }
        return 0;
    });
    for (const value of allClips) {
        const key = value.clipID;
        rows.push(
            <ClipRow
                key={`${key}--${value}`}
                clip={value}
                onClick={() => onClick(key)}
                onRemove={() => {
                    dispatch.twitch.removeTwitchClip(key);
                }}
            />
        );
    }

    // If the name is not provided
    React.useEffect(() => {
        if (!twitchUser && authToken) {
            dispatch.tempContainer.updateUser(authToken);
        }
    });

    const onSignOut = () => {
        dispatch.twitch.clearAuthToken();
    };
    return (
        <div>
            <h2>Twitch Integration</h2>
            {!authToken ?
                <TwitchConnectButton onClick={() => dispatch.twitch.fetchTwitchToken()} />
                : twitchUser ?
                    <TwitchUserStatus
                        displayName={twitchUser.displayName}
                        image={twitchUser.profilePictureUrl}
                        channel={twitchUser.name}
                        onSignOut={onSignOut}
                    />
                    :
                    <Loader active={true} inline={true} content="Loading" />
            }
            <h3>Clips</h3>
            {rows.length > 0 && <ClipsTable>{rows}</ClipsTable>}
        </div>
    );
};
