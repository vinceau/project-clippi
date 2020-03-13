import * as React from "react";

import styled, { css } from "styled-components";

import { pulseAnimation } from "../styles/animations";

export const ScanningDot: React.FC<{
    color: string;
    shouldPulse?: boolean;
}> = props => {
    const animated = css`
    animation: ${pulseAnimation("6px", props.color)}
    `;
    const InnerScanningDot = styled.span`
        height: 10px;
        width: 10px;
        background-color: ${props.color};
        border-radius: 50%;
        display: inline-block;
        margin-right: 5px;
        ${props.shouldPulse && animated}
    `;
    return (<InnerScanningDot />);

};