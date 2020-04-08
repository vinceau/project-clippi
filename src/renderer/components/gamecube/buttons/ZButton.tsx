import React from "react";

import styled from "styled-components";

export const ZButton: React.FC<{
    pressed?: boolean;
    color?: string;
    onClick?: () => void;
}> = (props) => {
    const { pressed, onClick } = props;
    const buttonColor = props.color || "#6F1FFF";
    const textColor = "white";
    const Outer = styled.div`
        width: 18em;
        height: 5em;
        border-radius: 3.5em;
        background-color: ${pressed ? buttonColor : "transparent"}
        border: solid 0.4em ${buttonColor};
        display: flex;
        justify-content: center;
        align-items: center;
        ${onClick && `
            cursor: pointer;
            &:hover {
                ${pressed ? "opacity: 0.85;" : `
                background-color: ${buttonColor};
                span {
                    color : ${textColor};
                }
                `}
            }
        `}
        span {
            font-size: 3.5em;
            color: ${pressed ? textColor : buttonColor};
        }
    `;
    return (
        <Outer onClick={onClick}>
            <span>Z</span>
        </Outer>
    );
};