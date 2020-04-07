import React from "react";

import styled from "styled-components";

export const DLeft: React.FC<{
    pressed?: boolean;
    color?: string;
    onClick?: (value: boolean) => void;
}> = (props) => {
    const { pressed } = props;
    const onClick = () => {
        if (props.onClick) {
            props.onClick(!pressed);
        }
    };
    const buttonColor = props.color ? props.color : "#8F8F8F";
    const Outer = styled.div`
        width: 6em;
        height: 5em;
        border-top-left-radius: 1em;
        border-bottom-left-radius: 1em;
        background-color: ${pressed ? buttonColor : "transparent"}
        border: solid 0.4em ${buttonColor};
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5em 1em;
        ${props.onClick && "cursor: pointer"}
        svg {
            overflow: visible;
        }
    `;
    const strokeColor = pressed ? "white" : buttonColor;
    const fillColor = pressed ? buttonColor : "none";
    return (
        <Outer onClick={onClick}>
            <svg width="100%" viewBox="0 0 35 30" version="1.1" overflow="visible">
                <g id="Page-1" stroke={strokeColor} strokeWidth="0.3em" fill="none" fillRule="evenodd">
                    <g id="ButtonIcon-GCN-D-Pad" transform="translate(-15.000000, -82.000000)" fill={fillColor} fillRule="nonzero">
                        <path d="M46.068359,82.65039 C45.890278,82.66651 45.722704,82.70784 45.570312,82.77539 L15.736328,96 C15.373438,96.16086 15.131193,96.54298 14.984375,97 C15.131193,97.45702 15.373438,97.83914 15.736328,98 L45.570312,111.22461 C46.789449,111.76504 49.035156,110.55816 49.035156,109.22461 L49.035156,84.77539 C49.035156,83.60853 47.314929,82.53758 46.068359,82.65039 Z" id="path4221" />
                    </g>
                </g>
            </svg>
        </Outer>
    );
};