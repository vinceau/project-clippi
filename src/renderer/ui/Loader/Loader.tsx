import { clsx } from "clsx";
import React from "react";
import styles from "./Loader.module.css";

interface LoaderProps {
  active?: boolean;
  inline?: boolean;
  content?: string;
}

export function Loader({ active, inline, content }: LoaderProps) {
  if (!active) return null;

  return (
    <div className={clsx(styles.loader, inline && styles.inline)}>
      <div className={styles.spinner} />
      {content && <span className={styles.text}>{content}</span>}
    </div>
  );
}
