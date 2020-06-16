import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { Header, Icon, Loader, Segment } from "semantic-ui-react";

import { FormContainer, PageHeader } from "@/components/Form";
import { TwitchClipInfo, TwitchConnectButton, TwitchUserStatus } from "@/components/twitch";
import { Dispatch, iRootState } from "@/store";

export const TwitchIntegration: React.FC = () => {
  const { twitchUser, twitchLoading } = useSelector((state: iRootState) => state.tempContainer);
  const dispatch = useDispatch<Dispatch>();
  const { clips } = useSelector((state: iRootState) => state.twitch);
  const allClips = Object.values(clips).sort((x, y) =>
    x.timestamp > y.timestamp ? -1 : x.timestamp < y.timestamp ? 1 : 0
  );

  const onSignOut = () => {
    dispatch.tempContainer.logOutTwitch();
  };
  return (
    <FormContainer>
      <PageHeader>Twitch Integration</PageHeader>
      {twitchUser ? (
        <TwitchUserStatus
          displayName={twitchUser.displayName}
          image={twitchUser.profilePictureUrl}
          channel={twitchUser.name}
          onSignOut={onSignOut}
        />
      ) : twitchLoading ? (
        <Loader active={true} inline={true} content="Loading" />
      ) : (
        <TwitchConnectButton onClick={() => dispatch.tempContainer.authenticateTwitch()} />
      )}
      <h2>Clips</h2>
      {allClips.length > 0 ? (
        allClips.map((v) => (
          <TwitchClipInfo key={v.clipID} clip={v} onRemove={(key) => dispatch.twitch.removeTwitchClip(key)} />
        ))
      ) : (
        <Segment placeholder>
          <Header icon>
            <Icon name="twitch" />
            You have not created any Twitch clips
          </Header>
        </Segment>
      )}
    </FormContainer>
  );
};
