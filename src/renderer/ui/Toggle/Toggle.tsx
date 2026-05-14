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

export const Toggle = ({ label, value, onChange: onChangeProp }: { label: string; value: boolean; onChange?: (checked: boolean) => void }) => {
  const onChange = (value: boolean) => {
    if (onChangeProp) {
      onChangeProp(value);
    }
  };
  return (
    <ToggleOuter>
      <Label
        style={{ cursor: onChangeProp ? "pointer" : "auto", marginBottom: "0" }}
        onClick={() => onChange(!value)}
      >
        {label}
      </Label>
      <Checkbox checked={value} onChange={(_, data) => onChange(Boolean(data.checked))} toggle={true} />
    </ToggleOuter>
  );
};
