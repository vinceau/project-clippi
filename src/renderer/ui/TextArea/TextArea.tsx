import { clsx } from "clsx";
import React from "react";
import styles from "./TextArea.module.css";

interface TextAreaProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  monospace?: boolean;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ value, placeholder, disabled, rows, monospace, onBlur, onChange }, ref) {
    return (
      <textarea
        ref={ref}
        className={clsx(styles.textarea, monospace && styles.monospace)}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        onBlur={onBlur}
        onChange={onChange}
      />
    );
  },
);
