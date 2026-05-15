import { clsx } from "clsx";
import React from "react";
import styles from "./Label.module.css";

interface LabelProps {
  circular?: boolean;
  color?: string;
  empty?: boolean;
  size?: "small" | "default" | "large";
  as?: React.ElementType;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function Label({ circular, color, empty, size, as: Tag = "span", children, onClick }: LabelProps) {
  return (
    <Tag
      className={clsx(
        styles.label,
        size === "small" && styles.small,
        size === "large" && styles.large,
        circular && styles.circular,
        empty && styles.empty,
        color === "red" && styles.colorRed,
        color === "blue" && styles.colorBlue,
        color === "green" && styles.colorGreen,
        color === "yellow" && styles.colorYellow
      )}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}
