import React from "react";

import styled from "styled-components";

export const BButton: React.FC<{
    pressed?: boolean;
    color?: string;
    onClick?: () => void;
}> = (props) => {
    const { pressed, onClick } = props;
    const buttonColor = props.color || "#BF2323";
    const textColor = "white";
    const Outer = styled.div`
        width: 5em;
        height: 5em;
        border-radius: 50%;
        background-color: ${pressed ? buttonColor : "transparent"}
        border: solid 0.4em ${buttonColor};
        display: flex;
        justify-content: center;
        align-items: center;
        ${onClick && `
            cursor: pointer;
        `}
        span {
            font-size: 3.2em;
            color: ${pressed ? textColor : buttonColor}
        }
    `;
    return (
        <Outer onClick={onClick}>
            <span>B</span>
        </Outer>
    );
};