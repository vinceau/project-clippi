import React from "react";

import styled from "styled-components";

export const BButton: React.FC<{
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
    const buttonColor = props.color ? props.color : "red";
    const Outer = styled.div`
        width: 5em;
        height: 5em;
        border-radius: 50%;
        background-color: ${pressed ? buttonColor : "transparent"}
        border: solid 0.4em ${buttonColor};
        display: flex;
        justify-content: center;
        align-items: center;
        ${props.onClick && "cursor: pointer"}
    `;
    const Text = styled.span`
        font-size: 3.2em;
        color: ${pressed ? "white" : buttonColor}
    `;
    return (
        <Outer onClick={onClick}>
            <Text>B</Text>
        </Outer>
    );
};