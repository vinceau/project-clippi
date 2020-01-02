import * as React from "react";

import styled from "styled-components";

import { Tooltip } from "react-tippy";

export const LabelledButton = (props: any) => {
    const { onClick, children, ...rest} = props;
    const Outer = styled.span`
    cursor: pointer;
    `;
    return (
        <Outer onClick={props.onClick}>
            <Tooltip arrow={true} duration={200} position="bottom" style={{ display: "inline-block" }} {...rest}>
                {props.children}
            </Tooltip>
        </Outer>
    );
};
