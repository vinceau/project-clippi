import * as React from "react";

import styled from "styled-components";

import { Tooltip } from "react-tippy";

export const LabelledButton: React.FC<{
    title: string;
    onClick: () => void;
}> = props => {
    const Outer = styled.span`
    cursor: pointer;
    `;
    return (
        <Outer onClick={props.onClick}>
            <Tooltip arrow={true} duration={200} position="bottom" title={props.title}>
                {props.children}
            </Tooltip>
        </Outer>
    );
};
