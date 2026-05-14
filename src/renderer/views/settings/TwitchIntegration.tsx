import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "@/ui/Header/Header";
import { Icon } from "@/ui/Icon/Icon";
import { Loader } from "@/ui/Loader/Loader";
import { Segment } from "@/ui/Segment/Segment";

import { Field, FormContainer, PageHeader } from "@/components/Form";
import { Toggle } from "@/ui/Toggle/Toggle";
import { TwitchClipList, TwitchConnectButton, TwitchUserStatus } from "@/components/twitch";
import { TwitchClipClearDialog } from "@/components/twitch/TwitchClipClearDialog";
import type { Dispatch, iRootState } from "@/store";

import styles from "./TwitchIntegration.module.css";

const TWITCH_CLIPS_PER_PAGE = 10;

export function TwitchIntegration() {
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
        <Loader active inline content="Loading" />
      ) : (
        <TwitchConnectButton onClick={() => dispatch.tempContainer.authenticateTwitch()} />
      )}

      <Field padding="both" border="bottom">
        <Toggle value={reconnectTwitch} onChange={onReconnectChange} label="Auto-connect with Twitch on startup" />
      </Field>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Clips</h2>
          {allClips.length > 0 && (
            <TwitchClipClearDialog
              trigger={
                <div className={styles.clearTrigger}>
                  Clear all
                </div>
              }
              onClear={dispatch.twitch.clearAllTwitchClips}
            />
          )}
        </div>
        {allClips.length > 0 ? (
          <TwitchClipList
            clips={allClips}
            clipsPerPage={TWITCH_CLIPS_PER_PAGE}
            onRemove={dispatch.twitch.removeTwitchClip}
          />
        ) : (
          <Segment placeholder>
            <Header icon>
              <Icon name="twitch" />
              You have not created any Twitch clips
            </Header>
          </Segment>
        )}
      </div>
    </FormContainer>
  );
}
