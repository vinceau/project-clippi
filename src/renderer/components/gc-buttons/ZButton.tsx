import React from "react";

import styled from "styled-components";

export const ZButton: React.FC<{
    pressed?: boolean;
    onClick?: () => void;
}> = (props) => {
    const { pressed, onClick } = props;
    const Outer = styled.div`
        width: 24em;
        height: 7em;
        border-radius: 3.5em;
        background-color: ${pressed ? "#6F1FFF" : "transparent"}
        border: solid 0.5em #6F1FFF;
        display: flex;
        justify-content: center;
        align-items: center;
        ${onClick && "cursor: pointer"}
    `;
    const Text = styled.span`
        font-size: 4.8em;
        color: ${pressed ? "white" : "#6F1FFF"}
    `;
    return (
        <Outer onClick={onClick}>
            <Text>Z</Text>
        </Outer>
    );
};