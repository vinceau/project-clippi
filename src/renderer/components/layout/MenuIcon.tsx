import React from "react";
import styled from "styled-components";

import { transparentize } from "polished";
import { Link, Route } from "react-router-dom";
import { TippyLabel } from "../Labelled";

const OuterMenuIcon = styled.div<{
  active?: boolean;
}>`
  position: relative;
  height: 7rem;
  width: 100%;
  color: ${({ theme }) => transparentize(0.5, theme.foreground)};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  border-left: solid 0.4rem transparent;
  ${(props) =>
    props.active &&
    `
    color: ${props.theme.foreground};
    border-left-color: ${props.theme.foreground};
    background-color: ${transparentize(0.7, props.theme.foreground)};
    `}

  &:hover {
    color: ${({ theme }) => transparentize(0.25, theme.foreground)};
    background-color: ${({ theme }) => transparentize(0.85, theme.foreground)};
  }
`;

export const MenuIcon: React.FC<{
  active?: boolean;
  label?: string;
}> = (props) => {
  return (
    <TippyLabel title={props.label} size="big" distance={-70} duration={200} position="right" style={{ width: "100%" }}>
      <OuterMenuIcon active={props.active}>{props.children}</OuterMenuIcon>
    </TippyLabel>
  );
};

export const MenuIconLink: React.FC<{
  label: string;
  to: string;
  hidden?: boolean;
}> = (props) => {
  if (props.hidden) {
    return null;
  }
  return (
    <Link to={props.to}>
      <Route path={props.to}>
        {({ match }) => (
          <MenuIcon active={Boolean(match)} label={props.label}>
            {props.children}
          </MenuIcon>
        )}
      </Route>
    </Link>
  );
};
