import { clsx } from "clsx";
import React from "react";
import styles from "./Divider.module.css";

interface DividerProps {
  vertical?: boolean;
  horizontal?: boolean;
  children?: React.ReactNode;
}

export function Divider({ vertical, horizontal, children }: DividerProps) {
  return (
    <div className={clsx(styles.divider, vertical && styles.vertical, horizontal && styles.horizontal)}>
      {children && <span className={styles.text}>{children}</span>}
    </div>
  );
}
