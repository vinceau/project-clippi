/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";

import { getStatic } from "@/lib/utils";
import { Character, getCharacterShortName } from "@vinceau/slp-realtime";

export const CharacterIcon: React.FC<{
  character: Character;
  size?: number;
  grayscale?: boolean;
}> = (props) => {
  const imgSize = props.size || 24;
  let imgSrc: string;
  try {
    const filename = characterToFilename(props.character);
    imgSrc = getStatic(`/images/character-icons/${filename}`);
  } catch (err) {
    imgSrc = getStatic(`/images/unknown.png`);
  }
  return (
    <img
      src={imgSrc}
      css={css`
        height: ${imgSize}px;
        width: ${imgSize}px;
        ${props.grayscale && `filter: grayscale(1)`};
      `}
    />
  );
};

const characterToFilename = (character: Character): string => {
  return `${getCharacterShortName(character).toLowerCase()}_default.png`;
};
