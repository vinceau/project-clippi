import { clsx } from "clsx";
import React from "react";

import styles from "./ScanningDot.module.css";

export function ScanningDot({ color, shouldPulse }: { color: string; shouldPulse?: boolean }) {
  return (
    <span
      className={clsx(styles.dot, shouldPulse && styles.pulse)}
      style={{ backgroundColor: color, "--pulse-color": color } as React.CSSProperties}
    />
  );
}
