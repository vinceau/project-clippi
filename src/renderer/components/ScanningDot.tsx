import React from "react";

import styles from "./ScanningDot.module.css";

export function ScanningDot({ color, shouldPulse }: { color: string; shouldPulse?: boolean }) {
  return (
    <span
      className={`${styles.dot} ${shouldPulse ? styles.pulse : ""}`}
      style={{ backgroundColor: color, "--pulse-color": color } as React.CSSProperties}
    />
  );
}
