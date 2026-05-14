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
        <BaseCheckbox.Indicator className={styles.indicator}>
          <CheckIcon className={styles.icon}/>
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
      {" "}
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />{" "}
    </svg>
  );
}
