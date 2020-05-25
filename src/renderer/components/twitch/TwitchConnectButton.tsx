import * as React from "react";

import { Icon } from "semantic-ui-react";
import styled from "@emotion/styled";

export const TwitchConnectButton: React.FC<{
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}> = (props) => {
  const twitchColor = "#6441A4";
  const ButtonText = styled.span`
    margin-left: 5px;
    font-size: 14px;
  `;
  const TwitchButton = styled.button`
    color: white;
    background-color: ${twitchColor};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 220px;
    border: 0;
    border-radius: 3px;
    padding: 5px 0;
    i.icon {
      font-size: 25px;
      margin: 5px 0;
    }
  `;
  return (
    <TwitchButton onClick={props.onClick}>
      <Icon name="twitch" />
      <ButtonText>Connect with Twitch</ButtonText>
    </TwitchButton>
  );
};
