import React from "react";

import { Field } from "react-final-form";
import { Checkbox, Grid, GridColumnProps } from "semantic-ui-react";

export interface PortSelectionProps {
  value?: number[];
  onChange?: (value: number[]) => void;
}

export const PortSelection: React.FC<PortSelectionProps> = (props) => {
  const { onChange } = props;
  const value = props.value || [];
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
  const allPorts = [1, 2, 3, 4];
  return (
    <Grid>
      {allPorts.map((p) => (
        <Grid.Column key={`port-selection-${p}`} {...columnProps}>
          <Checkbox label={`Port ${p}`} checked={value.includes(p)} onChange={() => newOnChange(p)} />
        </Grid.Column>
      ))}
    </Grid>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PortSelectAdapter: React.FC<any> = (props) => {
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
