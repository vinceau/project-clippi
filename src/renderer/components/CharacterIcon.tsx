import type { Character } from "@slippi/slippi-js";
import { getCharacterShortName } from "@vinceau/slp-realtime";
import React from "react";

import unknownImg from "@/styles/images/unknown.png";

import bowserImg from "@/styles/images/character-icons/bowser_default.png";
import dkImg from "@/styles/images/character-icons/dk_default.png";
import docImg from "@/styles/images/character-icons/doc_default.png";
import falcoImg from "@/styles/images/character-icons/falco_default.png";
import falconImg from "@/styles/images/character-icons/falcon_default.png";
import foxImg from "@/styles/images/character-icons/fox_default.png";
import ganonImg from "@/styles/images/character-icons/ganon_default.png";
import gnwImg from "@/styles/images/character-icons/gnw_default.png";
import icsImg from "@/styles/images/character-icons/ics_default.png";
import kirbyImg from "@/styles/images/character-icons/kirby_default.png";
import linkImg from "@/styles/images/character-icons/link_default.png";
import luigiImg from "@/styles/images/character-icons/luigi_default.png";
import marioImg from "@/styles/images/character-icons/mario_default.png";
import marthImg from "@/styles/images/character-icons/marth_default.png";
import mewtwoImg from "@/styles/images/character-icons/mewtwo_default.png";
import nessImg from "@/styles/images/character-icons/ness_default.png";
import peachImg from "@/styles/images/character-icons/peach_default.png";
import pichuImg from "@/styles/images/character-icons/pichu_default.png";
import pikachuImg from "@/styles/images/character-icons/pikachu_default.png";
import puffImg from "@/styles/images/character-icons/puff_default.png";
import royImg from "@/styles/images/character-icons/roy_default.png";
import samusImg from "@/styles/images/character-icons/samus_default.png";
import sheikImg from "@/styles/images/character-icons/sheik_default.png";
import ylImg from "@/styles/images/character-icons/yl_default.png";
import yoshiImg from "@/styles/images/character-icons/yoshi_default.png";
import zeldaImg from "@/styles/images/character-icons/zelda_default.png";

const characterIconMap: Record<string, string> = {
  bowser: bowserImg,
  dk: dkImg,
  doc: docImg,
  falco: falcoImg,
  falcon: falconImg,
  fox: foxImg,
  ganon: ganonImg,
  gnw: gnwImg,
  ics: icsImg,
  kirby: kirbyImg,
  link: linkImg,
  luigi: luigiImg,
  mario: marioImg,
  marth: marthImg,
  mewtwo: mewtwoImg,
  ness: nessImg,
  peach: peachImg,
  pichu: pichuImg,
  pikachu: pikachuImg,
  puff: puffImg,
  roy: royImg,
  samus: samusImg,
  sheik: sheikImg,
  yl: ylImg,
  yoshi: yoshiImg,
  zelda: zeldaImg,
};

export function CharacterIcon({
  character,
  size,
  grayscale,
}: {
  character: Character;
  size?: number;
  grayscale?: boolean;
}) {
  const imgSize = size ?? 24;
  const shortName = getCharacterShortName(character).toLowerCase();
  const imgSrc = characterIconMap[shortName] ?? unknownImg;
  return (
    <img
      src={imgSrc}
      style={{ height: imgSize, width: imgSize, filter: grayscale ? "grayscale(1)" : undefined }}
    />
  );
}
