import styled from "@emotion/styled";
import { transparentize } from "polished";
import React from "react";
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

export function MenuIcon({
  active,
  label,
  children,
}: {
  active?: boolean;
  label?: string;
  children?: React.ReactNode;
}) {
  return (
    <TippyLabel title={label} size="big" distance={-70} duration={200} position="right" style={{ width: "100%" }}>
      <OuterMenuIcon active={active}>{children}</OuterMenuIcon>
    </TippyLabel>
  );
}

export function MenuIconLink({
  label,
  to,
  hidden,
  children,
}: {
  label: string;
  to: string;
  hidden?: boolean;
  children?: React.ReactNode;
}) {
  if (hidden) {
    return null;
  }
  return (
    <Link to={to}>
      <Route path={to}>
        {({ match }) => (
          <MenuIcon active={Boolean(match)} label={label}>
            {children}
          </MenuIcon>
        )}
      </Route>
    </Link>
  );
}
