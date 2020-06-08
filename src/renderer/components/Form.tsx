import React from "react";

import { Checkbox } from "semantic-ui-react";
import styled from "@emotion/styled";

export const FormContainer = styled.div`
  max-width: 65rem;
`;

export const PageHeader = styled.h1`
  font-variant: all-small-caps;
  margin-bottom: 2rem;
`;

export const Label = styled.div`
  &&& {
    font-weight: 500;
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
`;

export const Text = styled.p<{
  margin?: string;
}>`
  font-size: 1.2rem;
  opacity: 0.8;
  ${(p) =>
    p.margin !== "none" &&
    `
margin-top: 1rem;
`}
`;

export const Field = styled.div<{
  border?: string;
  padding?: string;
}>`
${(p) =>
  (p.padding === "top" || p.padding === "both") &&
  `
padding-top: 2rem;
`}

${(p) =>
  (p.padding === "bottom" || p.padding === "both") &&
  `
padding-bottom: 2rem;
`}

${(p) =>
  (p.border === "top" || p.border === "both") &&
  `
border-top: solid 0.1rem ${p.theme.foreground3};
`}

${(p) =>
  (p.border === "bottom" || p.border === "both") &&
  `
border-bottom: solid 0.1rem ${p.theme.foreground3};
`}
`;
Field.defaultProps = {
  padding: "both",
};

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
