import { clsx } from "clsx";
import * as React from "react";
import { Toggle } from "@/ui/Toggle/Toggle";

import styles from "./ProcessSection.module.css";

function SlideReveal({ open, children }: { open: boolean; children?: React.ReactNode }) {
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
        <Toggle value={open} onChange={(checked) => onOpenChange(Boolean(checked))} />
      </div>
      <SlideReveal open={open}>
        <div className={styles.content}>{children}</div>
      </SlideReveal>
    </div>
  );
}
