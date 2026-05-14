import { Button as BaseButton } from "@base-ui/react";
import { clsx } from "clsx";
import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  primary?: boolean;
  color?: string;
  basic?: boolean;
  fluid?: boolean;
  inverted?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  content?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function Button({
  primary,
  color,
  basic,
  fluid,
  inverted,
  disabled,
  type = "button",
  content,
  onClick,
  children,
}: ButtonProps) {
  return (
    <BaseButton
      className={clsx(
        styles.button,
        primary && styles.primary,
        basic && styles.basic,
        fluid && styles.fluid,
        inverted && styles.inverted,
        color === "red" && styles.colorRed,
        color === "green" && styles.colorGreen,
        color === "blue" && styles.colorBlue,
      )}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {content || children}
    </BaseButton>
  );
}

export function ButtonGroup({ children }: { children?: React.ReactNode }) {
  return <div className={styles.group}>{children}</div>;
}

Button.Group = ButtonGroup;
