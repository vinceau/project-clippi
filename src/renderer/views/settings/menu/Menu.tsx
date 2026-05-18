import { clsx } from "clsx";
import React from "react";
import styles from "./Menu.module.css";

interface MenuProps {
  secondary?: boolean;
  vertical?: boolean;
  children?: React.ReactNode;
  className?: string;
}

interface MenuItemProps {
  active?: boolean;
  header?: boolean;
  name?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>, data?: { name?: string }) => void;
  children?: React.ReactNode;
  className?: string;
}

export function Menu({ secondary, vertical, children, className }: MenuProps) {
  return (
    <div className={clsx(styles.menu, secondary && styles.secondary, vertical && styles.vertical, className)}>
      {children}
    </div>
  );
}

export function MenuItem({ active, header, name, onClick, children, className }: MenuItemProps) {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(event, { name });
  };

  return (
    <div
      className={clsx(styles.item, active && styles.active, header && styles.header, className)}
      data-name={name}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

Menu.Item = MenuItem;
