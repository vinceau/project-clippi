import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header, Icon, Loader, Segment } from "semantic-ui-react";

import { Field, FormContainer, PageHeader, Toggle } from "@/components/Form";
import { TwitchClipList, TwitchConnectButton, TwitchUserStatus } from "@/components/twitch";
import type { Dispatch, iRootState } from "@/store";

const TWITCH_CLIPS_PER_PAGE = 10;

export const TwitchIntegration: React.FC = () => {
  const { twitchUser, twitchLoading } = useSelector((state: iRootState) => state.tempContainer);
  const { reconnectTwitch } = useSelector((state: iRootState) => state.twitch);
  const dispatch = useDispatch<Dispatch>();
  const { clips } = useSelector((state: iRootState) => state.twitch);
  const allClips = Object.values(clips).sort((x, y) =>
    x.timestamp > y.timestamp ? -1 : x.timestamp < y.timestamp ? 1 : 0
  );

  const onReconnectChange = (shouldReconnect: boolean) => {
    dispatch.twitch.setReconnectTwitch(shouldReconnect);
  };
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

      <Field padding="both" border="bottom">
        <Toggle value={reconnectTwitch} onChange={onReconnectChange} label="Auto-connect with Twitch on startup" />
      </Field>

      <h2>Clips</h2>
      {allClips.length > 0 ? (
        <TwitchClipList
          clips={allClips}
          clipsPerPage={TWITCH_CLIPS_PER_PAGE}
          onRemove={(key) => dispatch.twitch.removeTwitchClip(key)}
        />
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
