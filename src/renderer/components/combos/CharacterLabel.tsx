import styled from "@emotion/styled";
import type { Character } from "@slippi/slippi-js";
import * as React from "react";

import { CharacterIcon } from "../CharacterIcon";

const LabelContainer = styled.div<{
  isDisabled?: boolean;
}>`
  display: flex;
  align-items: center;
  ${(props) =>
    props.isDisabled
      ? `
    opacity: 0.5;
    cursor: not-allowed;
  `
      : ""}
`;

export const CharacterLabel: React.FC<{ characterId: Character; name: string; disabled?: boolean }> = (props) => {
  const isDisabled = props.disabled;
  return (
    <LabelContainer isDisabled={isDisabled}>
      <CharacterIcon character={props.characterId} grayscale={isDisabled} />
      <span style={{ marginLeft: "10px" }}>{props.name}</span>
    </LabelContainer>
  );
};
