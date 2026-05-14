import { clsx } from "clsx";
import React from "react";

import styles from "./Form.module.css";

export function FormContainer({ children, ...rest }: { children?: React.ReactNode; [key: string]: any }) {
  return <div {...rest}>{children}</div>;
}

export function PageHeader({ children, ...rest }: { children?: React.ReactNode; [key: string]: any }) {
  return (
    <h1 className={styles.pageHeader} {...rest}>
      {children}
    </h1>
  );
}

export function Label({ children, ...rest }: { children?: React.ReactNode; [key: string]: any }) {
  return (
    <div className={styles.label} {...rest}>
      {children}
    </div>
  );
}

export function Text({
  margin,
  children,
  ...rest
}: {
  margin?: string;
  children?: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <p className={clsx(styles.text, margin !== "none" && styles.textMargin)} {...rest}>
      {children}
    </p>
  );
}

export function Field({
  border,
  padding = "both",
  children,
  ...rest
}: {
  border?: string;
  padding?: string;
  children?: React.ReactNode;
  [key: string]: any;
}) {
  const borderClass =
    border === "top" || border === "both"
      ? border === "both"
        ? styles.borderBoth
        : border === "top"
          ? styles.borderTop
          : styles.borderBottom
      : border === "bottom"
        ? styles.borderBottom
        : undefined;
  const borderBottomClass =
    border === "bottom" || border === "both"
      ? border === "both"
        ? styles.borderBoth
        : border === "bottom"
          ? styles.borderBottom
          : undefined
      : undefined;
  const paddingClass =
    padding === "both"
      ? styles.field
      : padding === "top"
        ? styles.fieldPaddingTop
        : padding === "bottom"
          ? styles.fieldPaddingBottom
          : styles.fieldPaddingNone;
  return (
    <div
      className={clsx(
        paddingClass,
        (border === "top" || border === "both") && styles.borderTop,
        (border === "bottom" || border === "both") && styles.borderBottom
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
