import React from "react";
import { clsx } from "clsx";

import styles from "./CustomIcon.module.css";

export interface CustomIconProps {
  image: any;
  size?: string;
  color?: string;
}

export function CustomIcon({ image, color, size }: CustomIconProps) {
  return (
    <i
      className={clsx(styles.outer, styles.icon, size)}
      style={
        {
          "--custom-icon-mask": `url("${image}")`,
          "--custom-icon-color": color || undefined,
        } as React.CSSProperties
      }
    />
  );
}
