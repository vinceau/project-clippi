import styled from "@emotion/styled";
import React from "react";
import { Checkbox } from "semantic-ui-react";

import { Label } from "@/components/Form";

const ToggleOuter = styled(Label)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const Toggle: React.FC<{
  label: string;
  value: boolean;
  onChange?: (checked: boolean) => void;
}> = (props) => {
  const onChange = (value: boolean) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };
  return (
    <ToggleOuter>
      <Label
        style={{ cursor: props.onChange ? "pointer" : "auto", marginBottom: "0" }}
        onClick={() => onChange(!props.value)}
      >
        {props.label}
      </Label>
      <Checkbox checked={props.value} onChange={(_, data) => onChange(Boolean(data.checked))} toggle={true} />
    </ToggleOuter>
  );
};
