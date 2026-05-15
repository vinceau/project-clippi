import React from "react";

import styles from "./CustomIcon.module.css";

export interface CustomIconProps {
  image: any;
  size?: string;
  color?: string;
}

export function CustomIcon({ image, color, size }: CustomIconProps) {
  return (
    <i
      className={`${styles.outer} icon ${size || ""}`}
      style={
        {
          "--custom-icon-mask": `url("${image}")`,
          "--custom-icon-color": color || undefined,
        } as React.CSSProperties
      }
    />
  );
}
