import { clsx } from "clsx";
import React from "react";
import { Link, Route } from "react-router-dom";

import { Tooltip } from "@/ui/Tooltip/Tooltip";
import styles from "./MenuIcon.module.css";

export function MenuIcon({
  active,
  label = "",
  children,
}: {
  active?: boolean;
  label?: string;
  children?: React.ReactNode;
}) {
  return (
    <Tooltip title={label} position="right" triggerClassName={styles.fullWidth}>
      <div className={clsx(styles.outerMenuIcon, active && styles.active)}>{children}</div>
    </Tooltip>
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
