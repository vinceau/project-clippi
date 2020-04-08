import React from "react";

import styled from "styled-components";

export const YButton: React.FC<{
    pressed?: boolean;
    color?: string;
    onClick?: () => void;
}> = (props) => {
    const { onClick, pressed } = props;
    const yButtonColor = props.color ? props.color : "#8F8F8F";
    const Outer = styled.div`
    width: 9.5em;
    ${onClick && "cursor: pointer"}
    text {
        fill: ${pressed ? "white" : yButtonColor}
    }
    svg {
        overflow: visible;
    }
    `;
    const pathFill = pressed ? yButtonColor : "transparent";
    return (
        <Outer onClick={onClick}>
            <svg width="100%" viewBox="0 0 184 114" version="1.1" overflow="visible">
                <g>
                    <path fill={pathFill} stroke={yButtonColor} strokeWidth="8" d="M140.00391,0.935547 C99.02555,0.935547 57.892589,11.956132 22.404297,32.44531 C1.742057,44.37466 -5.337553,70.79479 6.591797,91.45703 C18.521147,112.11927 44.94127,119.19888 65.60352,107.26953 C88.13329,94.26196 113.98877,87.33398 140.00391,87.33398 C163.86261,87.33398 183.20313,67.99347 183.20312,44.13477 C183.20312,20.276066 163.86261,0.935547 140.00391,0.935547 Z" id="path-1" />
                    <text alignmentBaseline="middle" textAnchor="middle" x="50%" y="50%" fontSize="52">Y</text>
                </g>
            </svg>
        </Outer>
    );
};
