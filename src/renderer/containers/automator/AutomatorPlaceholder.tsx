import React from "react";
import { Icon } from "@/ui/Icon/Icon";

import styles from "./AutomatorPlaceholder.module.css";

export function AutomatorPlaceholder() {
  return (
    <div className={styles.outer}>
      <Icon size="huge" name="flag" />
      <div className={styles.notice}>
        <h2>No events added</h2>
        <p>Add an event to get started</p>
      </div>
    </div>
  );
}
