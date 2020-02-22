import React from "react";
import styled from "styled-components";

import { transparentize } from "polished";
import { Link, Route } from "react-router-dom";
import { Tooltip } from "react-tippy";

const OuterMenuIcon = styled.div<{
    active?: boolean;
}>`
    position: relative;
    height: 70px;
    width: 100%;
    color: ${({ theme }) => transparentize(0.5, theme.foreground)};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    border-left: solid 4px transparent;
    ${(props) => props.active && `
    color: ${props.theme.foreground};
    border-left-color: ${props.theme.foreground};
    background-color: ${transparentize(0.9, props.theme.foreground)};
    `}

    &:hover {
        color: ${({theme}) => transparentize(0.25, theme.foreground)};
        background-color: ${({theme}) => transparentize(0.95, theme.foreground)};
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
