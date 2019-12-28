import * as React from "react";
import { Field } from "react-final-form";
import { Grid, GridColumnProps, Checkbox, Form, CheckboxProps } from "semantic-ui-react";
import styled from "styled-components";

export const PortSelection = (props: any) => {
  const { value, onChange, ...rest } = props;
  const port1: boolean = value.includes(0);
  const port2: boolean = value.includes(1);
  const port3: boolean = value.includes(2);
  const port4: boolean = value.includes(3);
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
  return (
    // <PortSelectionContainer>
      <Grid>
        <Grid.Column {...columnProps}>
          <Checkbox label="Port 1" checked={port1} onChange={() => newOnChange(0)} />
        </Grid.Column>
        <Grid.Column {...columnProps}>
          <Checkbox label="Port 2" checked={port2} onChange={() => newOnChange(1)} />
        </Grid.Column>
        <Grid.Column {...columnProps}>
          <Checkbox label="Port 3" checked={port3} onChange={() => newOnChange(2)} />
        </Grid.Column>
        <Grid.Column {...columnProps}>
          <Checkbox label="Port 4" checked={port4} onChange={() => newOnChange(3)} />
        </Grid.Column>
      </Grid>
    // </PortSelectionContainer>
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
