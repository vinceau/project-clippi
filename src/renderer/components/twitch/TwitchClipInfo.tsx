import type { TwitchClip } from "common/types";
import React from "react";
import { Icon } from "@/ui/Icon/Icon";
import { format } from "timeago.js";

import { ExternalLink as A } from "../ExternalLink";
import { Labelled } from "../Labelled";

import styles from "./TwitchClipInfo.module.css";

export function TwitchClipInfo({
  clip,
  onRemove: onRemoveProp,
}: {
  clip: TwitchClip;
  onRemove?: (clipID: string) => void;
}) {
  const timestamp = format(clip.timestamp);
  const url = `https://clips.twitch.tv/${clip.clipID}`;
  const onRemove = () => {
    if (onRemoveProp) {
      onRemoveProp(clip.clipID);
    }
  };
  const channelUrl = clip.channel ? `https://twitch.tv/${clip.channel}` : undefined;
  return (
    <div className={styles.clipContainer}>
      <div>
        <Labelled title="Show clip in browser">
          <A href={url}>
            <h2>{clip.clipID}</h2>
          </A>
        </Labelled>
        <div className={styles.meta}>
          {clip.channel && (
            <span>
              <Labelled title="Go to Twitch channel">
                <A href={channelUrl}>{clip.channel}</A>
              </Labelled>{" "}
              {" | "}
            </span>
          )}{" "}
          {timestamp}
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        <Labelled title="Edit">
          <A href={`${url}/edit`}>
            <Icon name="pencil" />
          </A>
        </Labelled>
        <Labelled title="Remove">
          <Icon name="trash" onClick={onRemove} className={styles.trashIcon} />
        </Labelled>
      </div>
    </div>
  );
}
