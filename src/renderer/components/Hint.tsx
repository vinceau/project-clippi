import React from "react";

import { Tooltip } from "@/ui/Tooltip/Tooltip";
import styles from "./Hint.module.css";

export function Hint({ text, children }: { text: string; children?: React.ReactNode }) {
  return (
    <Tooltip title={text}>
      <span className={styles.outer}>{children}</span>
    </Tooltip>
  );
}
