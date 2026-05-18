import { Input as BaseInput } from "@base-ui/react";
import { clsx } from "clsx";
import { Eye, EyeOff } from "lucide-react";
import React from "react";
import styles from "./PasswordInput.module.css";

export interface PasswordInputProps {
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  fluid?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  tabIndex?: number;
  autoComplete?: string;
  autoCapitalize?: string;
  autoCorrect?: string;
  spellCheck?: boolean;
}

export function PasswordInput({
  placeholder,
  value,
  disabled,
  fluid,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  tabIndex,
  autoComplete,
  autoCapitalize,
  autoCorrect,
  spellCheck,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const toggle = () => setShowPassword((prev) => !prev);

  return (
    <div className={clsx(styles.wrapper, fluid && styles.fluid)}>
      <BaseInput
        className={styles.input}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        spellCheck={spellCheck}
      />
      <button
        type="button"
        className={styles.toggleButton}
        onClick={toggle}
        tabIndex={-1}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
