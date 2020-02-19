
import * as React from "react";

import styled, { css } from "styled-components";

export const CustomIcon: React.FC<{
    image: string;
    color: string;
    size?: number;
}> = (props) => {
    const size = (s: number) => css`
    height: ${s}px !important;
    width: ${s}px !important;
    `;
    const Outer = styled.i`
    &&& {
        ${props.size && size(props.size)}
        &::before {
            content: "";
            mask: url("${props.image}") no-repeat 100% 100%;
            mask-size: contain;
            background-color: ${props.color} !important;
            height: 100%;
            width: 100%;
            display: block;
        }
    }
    `;
    return (
        <Outer aria-hidden="true" className="icon" />
    );
};
