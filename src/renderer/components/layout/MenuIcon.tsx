import * as React from "react";

import styled from "styled-components";

import { Tooltip } from "react-tippy";
import { Icon } from "semantic-ui-react";

export const MenuIcon: React.FC<{
    active?: boolean;
    label?: string;
}> = (props) => {
    const Outer = styled.div`
        position: relative;
        height: 70px;
        width: 100%;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 25px;
        ${props.active && `
        border-left: solid 4px white;
        background-color: rgba(255, 255, 255, 0.05);
        `}
    `;
    return (
        <Tooltip title={props.label} size="big" distance={-70} duration={200} position="right" style={{ display: "inline-block", width: "100%" }}>
            <Outer>
                <Icon name="fast forward" />
            </Outer>
        </Tooltip>
    );
};
