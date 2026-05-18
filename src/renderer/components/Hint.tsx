import React from "react";

import styles from "./Hint.module.css";
import { Tooltip } from "@/ui/Tooltip/Tooltip";

export function Hint({ text, children }: { text: string; children?: React.ReactNode }) {
  return (
    <Tooltip title={text}>
      <span className={styles.outer}>{children}</span>
    </Tooltip>
  );
}
