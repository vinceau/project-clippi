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

export function CharacterLabel({
  characterId,
  name,
  disabled,
}: {
  characterId: Character;
  name: string;
  disabled?: boolean;
}) {
  const isDisabled = disabled;
  return (
    <LabelContainer isDisabled={isDisabled}>
      <CharacterIcon character={characterId} grayscale={isDisabled} />
      <span style={{ marginLeft: "10px" }}>{name}</span>
    </LabelContainer>
  );
}
