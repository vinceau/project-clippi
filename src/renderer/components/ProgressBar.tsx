import React from "react";

import styles from "./ProgressBar.module.css";

export function ProgressBar({ percent }: { percent: number }) {
  return <div className={styles.bar} style={{ width: `${percent}%` }} />;
}
