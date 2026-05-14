import { clsx } from "clsx";
import React from "react";
import styles from "./Header.module.css";

interface HeaderProps {
  icon?: boolean | string;
  content?: string;
  sub?: boolean;
  vertical?: boolean;
  children?: React.ReactNode;
}

export function Header({ icon: iconProp, content, sub, vertical, children }: HeaderProps) {
  const Tag = sub ? "h4" : "h3";

  return (
    <Tag className={clsx(styles.header, sub && styles.sub, iconProp && styles.icon, vertical && styles.vertical)}>
      {content || children}
    </Tag>
  );
}
