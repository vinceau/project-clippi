import { clsx } from "clsx";
import * as React from "react";
import { Checkbox } from "@/ui/Checkbox/Checkbox";

import styles from "./ProcessSection.module.css";

export function SlideReveal({ open, children }: { open: boolean; children?: React.ReactNode }) {
  return <div className={clsx(styles.slideReveal, open && styles.slideRevealOpen)}>{children}</div>;
}

export function ProcessSection({
  open,
  onOpenChange,
  label,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.outer}>
      <div className={styles.toolbar}>
        <h2 className={styles.sectionLabel} onClick={() => onOpenChange(!open)}>
          {label}
        </h2>
        <Checkbox toggle checked={open} onChange={(_, data) => onOpenChange(Boolean(data.checked))} />
      </div>
      <SlideReveal open={open}>
        <div className={styles.content}>{children}</div>
      </SlideReveal>
    </div>
  );
}
