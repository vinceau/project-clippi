import * as React from "react";

import { useDispatch, useSelector } from "react-redux";
import { Header, Icon, Loader, Segment } from "semantic-ui-react";

import { Dispatch, iRootState } from "@/store";
import { TwitchConnectButton, TwitchUserStatus, TwitchClipInfo } from "@/components/twitch";

export const TwitchIntegration = () => {
    const { twitchUser } = useSelector((state: iRootState) => state.tempContainer);
    const dispatch = useDispatch<Dispatch>();
    const { authToken, clips } = useSelector((state: iRootState) => state.twitch);
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

    // If the name is not provided
    React.useEffect(() => {
        if (!twitchUser && authToken) {
            dispatch.tempContainer.updateUser(authToken);
        }
    });

    const onSignOut = () => {
        dispatch.twitch.logOutTwitch();
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
            <h2>Clips</h2>
            {allClips.length > 0 ?
                allClips.map(v => <TwitchClipInfo key={v.clipID} clip={v} onRemove={(key) => dispatch.twitch.removeTwitchClip(key)}/>)
                :
                <Segment placeholder>
                    <Header icon>
                        <Icon name="twitch" />
                        You have not created any Twitch clips
                    </Header>
                </Segment>
            }
        </div>
    );
};
