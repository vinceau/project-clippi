import React from "react";
import styles from "./Message.module.css";

interface MessageProps {
  warning?: boolean;
  children?: React.ReactNode;
}

export function Message({ warning, children }: MessageProps) {
  return <div className={styles.message}>{children}</div>;
}
