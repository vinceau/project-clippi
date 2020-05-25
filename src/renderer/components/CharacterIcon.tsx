import * as React from "react";
import styled from "styled-components";

import { getStatic } from "@/lib/utils";
import { Character, getCharacterShortName } from "@vinceau/slp-realtime";

export const CharacterIcon: React.FC<{
  character: Character;
  size?: number;
  grayscale?: boolean;
}> = (props) => {
  const imgSize = props.size || 24;
  const Img = styled.img`
    height: ${imgSize}px;
    width: ${imgSize}px;
    ${props.grayscale && `filter: grayscale(1)`};
  `;
  const filename = characterToFilename(props.character);
  const imgSrc = getStatic(`/images/character-icons/${filename}`);
  return <Img src={imgSrc} />;
};

const characterToFilename = (character: Character): string => {
  return `${getCharacterShortName(character).toLowerCase()}_default.png`;
};
