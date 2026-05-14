import React from "react";
import { Field } from "react-final-form";
import type { GridColumnProps } from "@/ui/Grid/Grid";
import { Checkbox } from "@/ui/Checkbox/Checkbox";
import { Grid } from "@/ui/Grid/Grid";

export interface PortSelectionProps {
  label?: string;
  value?: number[];
  zeroIndex?: boolean;
  onChange?: (value: number[]) => void;
}

export const PortSelection = ({ zeroIndex, onChange, value = [], label = "Port" }: PortSelectionProps) => {
  const newOnChange = (port: number) => {
    let newValues: number[] = Array.from(value);
    if (value.includes(port)) {
      // We want to remove it from the list
      newValues = value.filter((a) => a !== port);
    } else {
      newValues.push(port);
    }
    newValues.sort();
    if (onChange) {
      onChange(newValues);
    }
  };
  const columnProps: GridColumnProps = {
    mobile: 8,
    tablet: 4,
    computer: 4,
  };
  let allPorts = [1, 2, 3, 4];
  if (zeroIndex) {
    allPorts = allPorts.map((n) => n - 1);
  }
  return (
    <Grid>
      {allPorts.map((p) => (
        <Grid.Column key={`port-selection-${p}`} {...columnProps}>
          <Checkbox
            label={`${label} ${zeroIndex ? p + 1 : p}`}
            checked={value.includes(p)}
            onChange={() => newOnChange(p)}
          />
        </Grid.Column>
      ))}
    </Grid>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PortSelectAdapter = (props: any) => {
  const { name, ...rest } = props;
  return (
    <Field name={name}>
      {(fprops) => {
        const { input, ...frest } = fprops;
        return <PortSelection {...rest} {...frest} {...input} />;
      }}
    </Field>
  );
};
