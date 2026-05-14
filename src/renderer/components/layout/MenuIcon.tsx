import { clsx } from "clsx";
import React from "react";
import { Link, Route } from "react-router-dom";

import { TippyLabel } from "../Labelled";

import styles from "./MenuIcon.module.css";

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
      <div className={clsx(styles.outerMenuIcon, active && styles.active)}>{children}</div>
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
