import * as React from "react";

import { useDispatch, useSelector } from "react-redux";

import { Dispatch, iRootState } from "@/store";

import {Loader} from "semantic-ui-react";
import { TwitchUserStatus, TwitchConnectButton } from "../TwitchConnect";

export const TwitchIntegration = () => {
    const { twitchUser } = useSelector((state: iRootState) => state.tempContainer);
    const dispatch = useDispatch<Dispatch>();
    const { authToken, clips } = useSelector((state: iRootState) => state.twitch);
    const rows: JSX.Element[] = [];
    for (const [key, value] of Object.entries(clips)) {
        rows.push(<div key={`${key}--${value}`}>{value.clipID}</div>);
    }

    // If the name is not provided
    React.useEffect(() => {
        if (!twitchUser) {
            dispatch.tempContainer.updateUser(authToken);
        }
    });

    const onSignOut = () => {
        dispatch.twitch.clearAuthToken();
    }
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
                <Loader active={true} content="Loading" />
            }
            <h3>Clips</h3>
            {rows}
        </div>
    );
};
