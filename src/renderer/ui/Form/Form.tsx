import { Field as BaseField, Form as BaseForm } from "@base-ui/react";
import { clsx } from "clsx";
import React from "react";
import styles from "./Form.module.css";

interface FormProps {
  onSubmit?: () => void;
  children?: React.ReactNode;
}

interface FormFieldProps {
  error?: boolean;
  children?: React.ReactNode;
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

function Form({ onSubmit, children }: FormProps) {
  return (
    <BaseForm className={styles.form} onFormSubmit={() => onSubmit?.()}>
      {children}
    </BaseForm>
  );
}
Form.defaultProps = { onSubmit: undefined, children: undefined };

function FormField({ error, children }: FormFieldProps) {
  return (
    <BaseField.Root invalid={error} className={clsx(styles.field, error && styles.error)}>
      {children}
    </BaseField.Root>
  );
}

function FormInput({ icon, ...props }: FormInputProps) {
  return (
    <>
      {icon && <span>{icon}</span>}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <input {...props} />
    </>
  );
}

Form.Field = FormField;
Form.Input = FormInput;

export { Form, FormField, FormInput };
