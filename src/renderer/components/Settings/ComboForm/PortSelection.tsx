import * as React from "react";
import { Field } from "react-final-form";
import { Checkbox, Grid, GridColumnProps } from "semantic-ui-react";

export const PortSelection = (props: any) => {
  const { value, onChange } = props;
  const newOnChange = (port: number) => {
    let newValues: number[] = Array.from(value);
    if (value.includes(port)) {
      // We want to remove it from the list
      newValues = (value as number[]).filter(a => a !== port);
    } else {
      newValues.push(port);
    }
    newValues.sort();
    onChange(newValues);
  };
  const columnProps: GridColumnProps = {
    mobile: 8,
    tablet: 4,
    computer: 4,
  };
  const allPorts = [0, 1, 2, 3];
  return (
    <Grid>
      {allPorts.map(p => (
        <Grid.Column key={`port-selection-${p}`} {...columnProps}>
          <Checkbox label={`Port ${p + 1}`} checked={value.includes(p)} onChange={() => newOnChange(p)} />
        </Grid.Column>
      ))}
    </Grid>
  );
};

export const PortSelectAdapter = (props: any) => {
  const { name, ...rest } = props;
  return (<Field name={name}>
    {fprops => {
      const { input, ...frest } = fprops;
      return (
        <PortSelection {...rest} {...frest} {...input} />
      );
    }}
  </Field>);
};
