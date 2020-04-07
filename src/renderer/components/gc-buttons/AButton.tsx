import React from "react";

import styled from "styled-components";

export const AButton: React.FC<{
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
    const buttonColor = props.color ? props.color : "green";
    const Outer = styled.div`
        width: 9em;
        height: 9em;
        border-radius: 50%;
        background-color: ${pressed ? buttonColor : "transparent"}
        border: solid 0.5em ${buttonColor};
        display: flex;
        justify-content: center;
        align-items: center;
        ${props.onClick && "cursor: pointer"}
    `;
    const Text = styled.span`
        font-size: 4.8em;
        color: ${pressed ? "white" : buttonColor}
    `;
    return (
        <Outer onClick={onClick}>
            <Text>A</Text>
        </Outer>
    );
};