import React from "react";
import { Checkbox } from "semantic-ui-react";

import { Label } from "@/components/Form";

import styles from "./Toggle.module.css";

export function Toggle({
  label,
  value,
  onChange: onChangeProp,
}: {
  label: string;
  value: boolean;
  onChange?: (checked: boolean) => void;
}) {
  const onChange = (value: boolean) => {
    if (onChangeProp) {
      onChangeProp(value);
    }
  };
  return (
    <div className={styles.toggleOuter}>
      <Label style={{ cursor: onChangeProp ? "pointer" : "auto", marginBottom: "0" }} onClick={() => onChange(!value)}>
        {label}
      </Label>
      <Checkbox checked={value} onChange={(_, data) => onChange(Boolean(data.checked))} toggle />
    </div>
  );
}
