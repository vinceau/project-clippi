import styled from "@emotion/styled";
import React from "react";
import { Icon } from "@/ui/Icon/Icon";

const ButtonText = styled.span`
  margin-left: 5px;
  font-size: 14px;
`;
const TwitchButton = styled.button<{
  backgroundColor: string;
}>`
  color: white;
  background-color: ${(props) => props.backgroundColor};
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

export function TwitchConnectButton({
  onClick,
}: {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
  return (
    <TwitchButton backgroundColor="#6441A4" onClick={onClick}>
      <Icon name="twitch" />
      <ButtonText>Connect with Twitch</ButtonText>
    </TwitchButton>
  );
}
