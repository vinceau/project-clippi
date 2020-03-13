
import { Character } from "@vinceau/slp-realtime";
import * as React from "react";
import styled from "styled-components";

import { CharacterIcon } from "../CharacterIcon";

export const CharacterLabel: React.FC<{ characterId: Character, name: string, disabled?: boolean }> = (props) => {
  const isDisabled = props.disabled;
  const LabelContainer = styled.div`
    display: flex;
    align-items: center;
    ${isDisabled && `
      opacity: 0.5;
      cursor: not-allowed;
    `}
  `;
  return (
    <LabelContainer>
      <CharacterIcon character={props.characterId} grayscale={isDisabled} />
      <span style={{marginLeft: "10px"}}>{props.name}</span>
    </LabelContainer>
  );
};
