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

export const CustomIcon: React.FC<{
    image: string;
    color: string;
}> = (props) => {
    const Outer = styled.i`
    &&&::before {
        content: "";
        mask: url("${props.image}") no-repeat 100% 100%;
        mask-size: contain;
        background-color: ${props.color} !important;
        height: 100%;
        width: 100%;
        display: block;
    }
    `;
    return (
        <Outer aria-hidden="true" className="icon" />
    );
};