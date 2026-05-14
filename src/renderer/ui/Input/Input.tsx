import { clsx } from "clsx";
import React from "react";
import styles from "./Input.module.css";

interface InputProps {
  label?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  fluid?: boolean;
  transparent?: boolean;
  disabled?: boolean;
  type?: string;
  autoCapitalize?: string;
  autoComplete?: string;
  autoCorrect?: string;
  spellCheck?: boolean;
  tabIndex?: number;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function Input({
  label,
  name,
  placeholder,
  value,
  fluid,
  transparent,
  disabled,
  type = "text",
  autoCapitalize,
  autoComplete,
  autoCorrect,
  spellCheck,
  tabIndex,
  onFocus,
  onBlur,
  onKeyDown,
  onChange,
}: InputProps) {
  return (
    <div className={clsx(styles.wrapper, fluid && styles.fluid)}>
      {label && <span className={styles.labelText}>{label}</span>}
      <input
        className={clsx(styles.input, fluid && styles.fluid, transparent && styles.transparent)}
        name={name}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        type={type}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        spellCheck={spellCheck}
        tabIndex={tabIndex}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onChange={onChange}
      />
    </div>
  );
}
