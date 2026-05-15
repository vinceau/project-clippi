import styled from "@emotion/styled";
import type { TwitchClip } from "common/types";
import { transparentize } from "polished";
import React from "react";
import { Icon } from "@/ui/Icon/Icon";
import { format } from "timeago.js";

import { device } from "@/styles/device";

import { ExternalLink as A } from "../ExternalLink";
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
    <ClipContainer>
      <div>
        <Labelled title="Show clip in browser">
          <A href={url}>
            <h2>{clip.clipID}</h2>
          </A>
        </Labelled>
        <div style={{ opacity: "0.7" }}>
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
      <ButtonsContainer>
        <Labelled title="Edit">
          <A href={`${url}/edit`}>
            <Icon name="pencil" />
          </A>
        </Labelled>
        <Labelled title="Remove">
          <Icon name="trash" onClick={onRemove} style={{ cursor: "pointer" }} />
        </Labelled>
      </ButtonsContainer>
    </ClipContainer>
  );
}
