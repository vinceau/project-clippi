import { Switch } from "@base-ui/react";
import React from "react";
import styles from "./Toggle.module.css";

interface ToggleProps {
  label?: string;
  value: boolean;
  onChange?: (checked: boolean) => void;
}

export function Toggle({ label, value, onChange: onChangeProp }: ToggleProps) {
  const onChange = (checked: boolean) => {
    if (onChangeProp) {
      onChangeProp(checked);
    }
  };
  return (
    <div className={styles.toggleOuter}>
      {label && <span>{label}</span>}
      <Switch.Root
        checked={value}
        onCheckedChange={(c) => onChange(c)}
        className={styles.switchRoot}
      >
        <Switch.Thumb className={styles.switchThumb} />
      </Switch.Root>
    </div>
  );
}
