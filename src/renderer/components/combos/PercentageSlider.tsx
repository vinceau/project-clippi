import React from "react";
import { Field } from "react-final-form";

import styles from "./PercentageSlider.module.css";
import { InputAdaptor } from "./FormAdapters";

export function PercentageSlider({ name, min: minProp, max: maxProp }: { name: string; min?: string; max?: string }) {
  const min = minProp || "0";
  const max = maxProp || "100";
  return (
    <div className={styles.outer}>
      <Field format={parseFloat} formatOnBlur name={name} min={min} max={max} component={InputAdaptor} type="text" />
      <Field
        format={parseFloat}
        formatOnBlur
        name={name}
        component="input"
        type="range"
        min={min}
        max={max}
        step={`${parseInt(max, 10) / 100}`}
      />
    </div>
  );
}
