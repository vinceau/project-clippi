import { clsx } from "clsx";
import React from "react";
import styles from "./Segment.module.css";

interface SegmentProps {
  placeholder?: boolean;
  children?: React.ReactNode;
}

export function Segment({ placeholder, children }: SegmentProps) {
  return <div className={clsx(styles.segment, placeholder && styles.placeholder)}>{children}</div>;
}
