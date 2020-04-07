import React from "react";

import styled from "styled-components";

export const RTrigger: React.FC<{
    pressed?: boolean;
    color?: string;
    onClick?: () => void;
}> = (props) => {
    const { pressed, onClick } = props;
    const buttonColor = props.color ? props.color : "#8F8F8F";
    const Outer = styled.div`
    width: 15em;
    ${onClick && "cursor: pointer"}
    text {
        fill: ${pressed ? "white" : buttonColor}
    }
    svg {
        overflow: visible;
    }
    `;
    const pathFill = pressed ? buttonColor : "transparent";
    return (
        <Outer onClick={onClick}>
            <svg width="100%" viewBox="0 0 235 141" version="1.1">
                <g>
                    <path transform="translate(117.920733, 70.343725) scale(-1, 1) translate(-117.920733, -70.343725)" fill={pathFill} strokeWidth="0.5em" stroke={buttonColor} d="M234.941486,37.9102532 C140.587902,69.5466833 51.1762154,107.627989 0.8999803,140.68745 C12.1209681,60.8935071 71.693988,0 143.5,0 C178.19432,0 210.03284,14.215631 234.941486,37.9102532 Z" id="path-1" />
                    <text alignmentBaseline="middle" textAnchor="middle" x="50%" y="33%" fontSize="4.8em">R</text>
                </g>
            </svg>
        </Outer>
    );
};