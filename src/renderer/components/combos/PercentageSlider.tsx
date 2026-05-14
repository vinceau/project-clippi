import styled from "@emotion/styled";
import React from "react";
import { Field } from "react-final-form";

const Outer = styled.div`
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
`;

export const PercentageSlider = ({ name, min: minProp, max: maxProp }: { name: string; min?: string; max?: string }) => {
  const min = minProp || "0";
  const max = maxProp || "100";
  return (
    <Outer>
      <Field
        format={parseFloat}
        formatOnBlur={true}
        name={name}
        min={min}
        max={max}
        component="input"
        type="text"
      />
      <Field
        format={parseFloat}
        formatOnBlur={true}
        name={name}
        component="input"
        type="range"
        min={min}
        max={max}
        step={`${parseInt(max, 10) / 100}`}
      />
    </Outer>
  );
};
