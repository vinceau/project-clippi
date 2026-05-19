import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "@/ui/Header/Header";
import { Segment } from "@/ui/Segment/Segment";
import { CustomIcon } from "@/ui/CustomIcon/CustomIcon";

import twitchIcon from "@/styles/images/twitch.svg";

import { Field, FormContainer, PageHeader } from "@/components/Form";
import { Toggle } from "@/ui/Toggle/Toggle";
import { TwitchClipList, TwitchUserStatus } from "@/components/twitch";
import { TwitchConnectContainer } from "@/components/twitch/TwitchConnectContainer";
import { TwitchClipClearDialog } from "@/components/twitch/TwitchClipClearDialog";
import type { Dispatch, iRootState } from "@/store";

import { Button } from "@/ui/Button/Button";
import styles from "./TwitchIntegration.module.css";

const TWITCH_CLIPS_PER_PAGE = 10;

export function TwitchIntegration() {
  const { twitchUser } = useSelector((state: iRootState) => state.tempContainer);
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
      ) : (
        <TwitchConnectContainer />
      )}

      <Field padding="both" border="bottom">
        <Toggle value={reconnectTwitch} onChange={onReconnectChange} label="Auto-connect with Twitch on startup" />
      </Field>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Clips</h2>
          {allClips.length > 0 && (
            <div>
              <TwitchClipClearDialog
                trigger={<span>Clear all</span>}
                triggerClassName={styles.clearTrigger}
                onClear={dispatch.twitch.clearAllTwitchClips}
              />
            </div>
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
            <Header icon vertical>
              <CustomIcon image={twitchIcon} style={{ width: "64px", height: "64px" }} />
              <div>You have not created any Twitch clips</div>
            </Header>
          </Segment>
        )}
      </div>
    </FormContainer>
  );
}
