import type { TwitchClip } from "common/types";
import React from "react";
import { Pencil, Trash } from "lucide-react";
import { format } from "timeago.js";

import { Tooltip } from "@/ui/Tooltip/Tooltip";
import { ExternalLink as A } from "../ExternalLink";

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
        <Tooltip title="Show clip in browser">
          <A href={url}>
            <h2>{clip.clipID}</h2>
          </A>
        </Tooltip>
        <div className={styles.meta}>
          {clip.channel && (
            <span>
              <Tooltip title="Go to Twitch channel">
                <A href={channelUrl}>{clip.channel}</A>
              </Tooltip>{" "}
              {" | "}
            </span>
          )}{" "}
          {timestamp}
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        <Tooltip title="Edit">
          <A href={`${url}/edit`}>
            <Pencil size={16} />
          </A>
        </Tooltip>
        <Tooltip title="Remove">
          <Trash size={16} onClick={onRemove} className={styles.trashIcon} />
        </Tooltip>
      </div>
    </div>
  );
}
