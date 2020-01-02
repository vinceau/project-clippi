import { transparentize } from "polished";
import { css, keyframes } from "styled-components";

const pulse = (size: string, color: string) => keyframes`
    0% {
        transform: scale(.95);
        box-shadow: 0 0 0 0 ${transparentize(0.5, color)};
    }
    70% {
        transform: scale(1);
        box-shadow: 0 0 0 ${size} ${transparentize(1, color)};
    }
    100% {
        transform: scale(.9);
        box-shadow: 0 0 0 0 ${transparentize(1, color)};
    }
`;

export const pulseAnimation = (size: string, color: string) => css`
    ${pulse(size, color)} 1.5s infinite;
`;
