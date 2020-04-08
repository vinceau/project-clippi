import React from "react";

import styled from "styled-components";

export const DpadDown: React.FC<{
    pressed?: boolean;
    color?: string;
    onClick?: () => void;
}> = (props) => {
    const { pressed, onClick } = props;
    const buttonColor = props.color ? props.color : "#8F8F8F";
    const Outer = styled.div`
        width: 5em;
        height: 6em;
        border-bottom-left-radius: 1em;
        border-bottom-right-radius: 1em;
        background-color: ${pressed ? buttonColor : "transparent"}
        border: solid 0.4em ${buttonColor};
        border-top-color: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5em;
        padding-top: 2em;
        ${onClick && "cursor: pointer"}
        svg {
            overflow: visible;
        }
    `;
    const strokeColor = pressed ? "white" : buttonColor;
    const fillColor = pressed ? buttonColor : "none";
    return (
        <Outer onClick={onClick}>
            <svg height="100%" viewBox="0 0 32 36" version="1.1">
                <g id="Page-1" stroke={strokeColor} strokeWidth="0.3em" fill="none" fillRule="evenodd">
                    <g id="ButtonIcon-GCN-D-Pad" transform="translate(-80.000000, -142.000000)" fill={fillColor} fillRule="nonzero">
                        <path d="M94,176.26367 C94.54034,177.48261 97.45966,177.48261 98,176.26367 L111.225,146.42969 C111.76543,145.21055 110.55855,142.96484 109.225,142.96484 L82.775,142.96484 C81.44145,142.96484 80.23457,145.21055 80.775,146.42969 L94,176.26367 Z" id="path3391" />
                    </g>
                </g>
            </svg>
        </Outer>
    );
};