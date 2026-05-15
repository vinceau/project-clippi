import { clsx } from "clsx";
import React from "react";
import styles from "./Grid.module.css";

interface GridProps {
  columns?: number;
  stackable?: boolean;
  textAlign?: "center" | "left" | "right";
  children?: React.ReactNode;
}

export function Grid({ columns, stackable, textAlign, children }: GridProps) {
  return (
    <div className={clsx(styles.grid, stackable && styles.stackable, textAlign === "center" && styles.textCenter)}>
      {children}
    </div>
  );
}

interface GridRowProps {
  verticalAlign?: "middle" | "top" | "bottom";
  children?: React.ReactNode;
}

export function GridRow({ verticalAlign, children }: GridRowProps) {
  return <div className={clsx(styles.row, verticalAlign === "middle" && styles.alignMiddle)}>{children}</div>;
}

export interface GridColumnProps {
  children?: React.ReactNode;
}

export function GridColumn({ children }: GridColumnProps) {
  return <div className={styles.column}>{children}</div>;
}

Grid.Row = GridRow;
Grid.Column = GridColumn;
