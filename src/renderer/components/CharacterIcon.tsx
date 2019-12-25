import * as React from "react";
import { Character } from "@vinceau/slp-realtime";
import { getStatic } from "@/lib/utils";
import styled from "styled-components";

// const pathToCats = require.context("../../../styles/images/icons/chars", true);
export const CharacterIcon: React.FC<{
    character: Character,
    size?: number,
    grayscale?: boolean,
}> = props => {
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
    return `${characterToShortname(character)}_default.png`;
};

const characterToShortname = (character: Character): string => {
    switch (character) {
        case Character.CAPTAIN_FALCON:
            return "falcon";
        case Character.DONKEY_KONG:
            return "dk";
        case Character.FOX:
            return "fox";
        case Character.GAME_AND_WATCH:
            return "gnw";
        case Character.KIRBY:
            return "kirby";
        case Character.BOWSER:
            return "bowser";
        case Character.LINK:
            return "link";
        case Character.LUIGI:
            return "luigi";
        case Character.MARIO:
            return "mario";
        case Character.MARTH:
            return "marth"
        case Character.MEWTWO:
            return "mewtwo";
        case Character.NESS:
            return "ness";
        case Character.PEACH:
            return "peach";
        case Character.PIKACHU:
            return "pikachu";
        case Character.ICE_CLIMBERS:
            return "ics";
        case Character.JIGGLYPUFF:
            return "puff";
        case Character.SAMUS:
            return "samus";
        case Character.YOSHI:
            return "yoshi";
        case Character.ZELDA:
            return "zelda";
        case Character.SHEIK:
            return "sheik";
        case Character.FALCO:
            return "falco";
        case Character.YOUNG_LINK:
            return "yl";
        case Character.DR_MARIO:
            return "doc";
        case Character.ROY:
            return "roy";
        case Character.PICHU:
            return "pichu";
        case Character.GANONDORF:
            return "ganon";
    }
};
