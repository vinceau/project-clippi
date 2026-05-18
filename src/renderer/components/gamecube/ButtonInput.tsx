import React from "react";

import styles from "./ButtonInput.module.css";
import { Tooltip } from "@/ui/Tooltip/Tooltip";
import { ButtonPicker } from "./ButtonPicker";
import { ButtonPreview } from "./ButtonPreview";

export function ButtonInput({ value, onChange }: { value?: string[]; onChange?: (newButtons: string[]) => void }) {
  return (
    <ButtonPicker value={value} onChange={onChange}>
      <Tooltip title="Click to select a button combination" style={{ width: "100%" }}>
        <div className={styles.target}>
          {value && value.length > 0 ? (
            <ButtonPreview value={value} pressed />
          ) : (
            <div className={styles.selectButton}>No buttons selected</div>
          )}
        </div>
      </Tooltip>
    </ButtonPicker>
  );
}
