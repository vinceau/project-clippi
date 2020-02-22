import * as React from "react";

import styled from "styled-components";

import { Link, Route } from "react-router-dom";
import { Tooltip } from "react-tippy";

const OuterMenuIcon = styled.div<{
    active?: boolean;
}>`
    position: relative;
    height: 70px;
    width: 100%;
    color: rgba(255, 255, 255, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    ${(props) => props.active && `
    color: white;
    border-left: solid 4px white;
    background-color: rgba(255, 255, 255, 0.1);
    `}

    &:hover {
        color: rgba(255, 255, 255, 0.75);
        background-color: rgba(255, 255, 255, 0.05);
    }
`;

export const MenuIcon: React.FC<{
    active?: boolean;
    label?: string;
}> = (props) => {
    return (
        <Tooltip title={props.label} size="big" distance={-70} duration={200} position="right" style={{ display: "inline-block", width: "100%" }}>
            <OuterMenuIcon active={props.active}>
                {props.children}
            </OuterMenuIcon>
        </Tooltip>
    );
};

export const MenuIconLink: React.FC<{
    label: string;
    to: string;
}> = (props) => {
    return (
        <Link to={props.to}>
            <Route
                path={props.to}
                children={({ match }) => (
                    <MenuIcon active={Boolean(match)} label={props.label}>
                        {props.children}
                    </MenuIcon>
                )}
            />
        </Link>
    );
};
