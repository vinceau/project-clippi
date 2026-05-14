import styled from "@emotion/styled";
import * as React from "react";
import { Checkbox } from "@/ui/Checkbox/Checkbox";
import { Form as SemanticForm } from "@/ui/Form/Form";
import { Input } from "@/ui/Input/Input";

import { Toggle } from "@/ui/Toggle/Toggle";

export const ToggleAdapter = (props: any) => {
  const { input, label } = props;
  return <Toggle value={input.value} label={label} onChange={input.onChange} />;
};

export const SemanticCheckboxInput = (props: any) => {
  const { input, label } = props;
  return (
    <SemanticForm.Field>
      <Checkbox checked={input.value} label={label} onChange={(_, obj) => input.onChange(obj.checked)} />
    </SemanticForm.Field>
  );
};

const StyledInput = styled(Input)`
  &&& input {
    width: 20px !important;
  }
`;

export const SemanticInput = (props: any) => {
  const { inputLabel, input, meta, ...rest } = props;
  return (
    <SemanticForm.Field error={meta.error && meta.touched}>
      {/* <RenderCount /> */}
      {inputLabel && <label>{inputLabel}</label>}
      <StyledInput {...input} {...rest} />
      {meta.error && meta.touched && <span style={{ color: "red" }}>{meta.error}</span>}
    </SemanticForm.Field>
  );
};
