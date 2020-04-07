import React from "react";

import styled from "styled-components";

export const DRight: React.FC<{
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
        border-top-right-radius: 1em;
        border-bottom-right-radius: 1em;
        background-color: ${pressed ? buttonColor : "transparent"}
        border: solid 0.4em ${buttonColor};
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5em 1em;
        ${onClick && "cursor: pointer"}
        svg {
            overflow: visible;
        }
    `;
    const strokeColor = pressed ? "white" : buttonColor;
    const fillColor = pressed ? buttonColor : "none";
    return (
        <Outer onClick={onClick}>
            <svg width="100%" viewBox="0 0 35 30" version="1.1">
                <g id="Page-1" stroke={strokeColor} strokeWidth="0.3em" fill="none" fillRule="evenodd">
                    <g id="ButtonIcon-GCN-D-Pad" transform="translate(-142.000000, -82.000000)" fill={fillColor} fillRule="nonzero">
                        <path d="M145.93164,82.65039 C144.68507,82.53758 142.96484,83.60853 142.96484,84.77539 L142.96484,109.22461 C142.96484,110.55816 145.21055,111.76504 146.42969,111.22461 L176.26367,98 C176.62656,97.83914 176.86881,97.45702 177.01562,97 C176.86881,96.54298 176.62656,96.16086 176.26367,96 L146.42969,82.77539 C146.2773,82.70784 146.10972,82.66651 145.93164,82.65039 Z" id="path4223" />
                    </g>
                </g>
            </svg>
        </Outer>
    );
};
