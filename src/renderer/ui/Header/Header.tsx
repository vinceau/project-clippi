import { clsx } from "clsx";
import React from "react";
import styles from "./Header.module.css";

interface HeaderProps {
  icon?: boolean | string;
  content?: string;
  sub?: boolean;
  vertical?: boolean;
  uppercase?: boolean;
  children?: React.ReactNode;
}

export function Header({ icon: iconProp, content, sub, vertical, uppercase, children }: HeaderProps) {
  const Tag = sub ? "h4" : "h3";

  return (
    <Tag
      className={clsx(
        styles.header,
        sub && styles.sub,
        iconProp && styles.icon,
        vertical && styles.vertical,
        uppercase && styles.uppercase
      )}
    >
      {content || children}
    </Tag>
  );
}
