import * as React from "react";
import { Checkbox } from "@/ui/Checkbox/Checkbox";
import { Form } from "@/ui/Form/Form";
import { Input } from "@/ui/Input/Input";

import { Toggle } from "@/ui/Toggle/Toggle";
import styles from "./FormAdapters.module.css";

export function ToggleAdapter(props: any) {
  const { input, label } = props;
  return <Toggle value={input.value} label={label} onChange={input.onChange} />;
}

export function CheckboxAdaptor(props: any) {
  const { input, label } = props;
  return (
    <Form.Field>
      <Checkbox checked={input.value} label={label} onChange={(checked) => input.onChange(checked)} />
    </Form.Field>
  );
}

export function InputAdaptor(props: any) {
  const { inputLabel, input, meta, ...rest } = props;
  return (
    <Form.Field error={meta.error && meta.touched}>
      {/* <RenderCount /> */}
      {inputLabel && <label>{inputLabel}</label>}
      <Input {...input} {...rest} />
      {meta.error && meta.touched && <span className={styles.errorText}>{meta.error}</span>}
    </Form.Field>
  );
}
