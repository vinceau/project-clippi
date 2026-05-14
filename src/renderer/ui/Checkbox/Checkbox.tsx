import { Checkbox as BaseCheckbox } from "@base-ui/react";
import { clsx } from "clsx";
import React from "react";
import styles from "./Checkbox.module.css";

interface CheckboxProps {
  checked?: boolean;
  label?: string;
  disabled?: boolean;
  toggle?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Checkbox({ checked, label, disabled, toggle, onChange }: CheckboxProps) {
  if (toggle) {
    return (
      <BaseCheckbox.Root
        checked={checked}
        disabled={disabled}
        onCheckedChange={(c) => onChange?.(c)}
        className={styles.toggleRoot}
      >
        <BaseCheckbox.Indicator className={styles.toggleIndicator} />
      </BaseCheckbox.Root>
    );
  }

  return (
    <label className={styles.wrapper}>
      <BaseCheckbox.Root
        checked={checked}
        disabled={disabled}
        onCheckedChange={(c) => onChange?.(c)}
        className={styles.root}
      >
        <BaseCheckbox.Indicator className={styles.indicator} />
      </BaseCheckbox.Root>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
