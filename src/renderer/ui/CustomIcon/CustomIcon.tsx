import React from "react";
import type { IconSizeProp } from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";

import styles from "./CustomIcon.module.css";

export interface CustomIconProps {
  image: any;
  size?: IconSizeProp;
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
