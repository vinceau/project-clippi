import React from "react";

import styled from "styled-components";

export const XButton: React.FC<{
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
    width: 8em;
    ${props.onClick && "cursor: pointer"}
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
            <svg width="100%" viewBox="0 0 114 184" version="1.1">
                <g>
                    <g id="Page-1" stroke={buttonColor} strokeWidth="0.5em" fill="none" fillRule="evenodd">
                        <g id="ButtonIcon-GCN-X" fill={pathFill} fillRule="nonzero">
                            <path d="M81.55434,22.403604 C69.62499,1.741363 43.20429,-5.338044 22.542047,6.591306 C1.879807,18.520657 -5.199603,44.941364 6.729747,65.60361 C19.737317,88.13338 26.665167,113.98847 26.665167,140.00361 C26.665167,163.86231 46.00647,183.20361 69.86517,183.20361 C93.72387,183.20361 113.06517,163.86231 113.06517,140.00361 C113.06517,99.02525 102.04352,57.891896 81.55434,22.403604 L81.55434,22.403604 Z" id="path4214" />
                        </g>
                    </g>
                    <text alignmentBaseline="middle" textAnchor="middle" x="50%" y="50%" fontSize="4.8em">X</text>
                </g>
            </svg>
        </Outer>
    );
};