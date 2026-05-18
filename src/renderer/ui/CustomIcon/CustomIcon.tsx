import React from "react";
import { clsx } from "clsx";

import styles from "./CustomIcon.module.css";

export interface CustomIconProps {
  image: any;
  color?: string;
  style?: React.CSSProperties;
}

export function CustomIcon({ image, color, style }: CustomIconProps) {
  return (
    <i
      className={clsx(styles.outer, styles.icon)}
      style={
        {
          "--custom-icon-mask": `url("${image}")`,
          "--custom-icon-color": color || "inherit",
          ...style,
        } as React.CSSProperties
      }
    />
  );
}
