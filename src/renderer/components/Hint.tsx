import React from "react";

import styles from "./Hint.module.css";
import { Labelled } from "./Labelled";

export function Hint({ text, children }: { text: string; children?: React.ReactNode }) {
  return (
    <Labelled title={text}>
      <span className={styles.outer}>{children}</span>
    </Labelled>
  );
}
