import React from "react";
import { Field } from "react-final-form";
import styled from "@emotion/styled";

const Outer = styled.div`
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
`;

export const PercentageSlider: React.FC<{
  name: string;
  min?: string;
  max?: string;
}> = (props) => {
  const min = props.min || "0";
  const max = props.max || "100";
  return (
    <Outer>
      <Field parse={(v) => parseFloat(v)} name={props.name} min={min} max={max} component="input" type="text" />
      <Field
        parse={(v) => parseFloat(v)}
        name={props.name}
        component="input"
        type="range"
        min={min}
        max={max}
        step={`${parseInt(max, 10) / 100}`}
      />
    </Outer>
  );
};
