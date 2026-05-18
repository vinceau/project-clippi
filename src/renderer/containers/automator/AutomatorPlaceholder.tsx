import React from "react";
import { Flag } from "lucide-react";

import styles from "./AutomatorPlaceholder.module.css";

export function AutomatorPlaceholder() {
  return (
    <div className={styles.outer}>
      <Flag size={64} />
      <div className={styles.notice}>
        <h2>No events added</h2>
        <p>Add an event to get started</p>
      </div>
    </div>
  );
}
