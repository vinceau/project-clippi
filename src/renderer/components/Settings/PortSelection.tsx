import * as React from "react";
import { Field } from "react-final-form";

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
    return (
        <div {...rest}>
            <label>Port 1<input type="checkbox" checked={port1} onChange={() => newOnChange(0)} /></label>
            <label>Port 2<input type="checkbox" checked={port2} onChange={() => newOnChange(1)} /></label>
            <label>Port 3<input type="checkbox" checked={port3} onChange={() => newOnChange(2)} /></label>
            <label>Port 4<input type="checkbox" checked={port4} onChange={() => newOnChange(3)} /></label>
        </div>
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
