import React from "react";

import { ButtonInput, ControllerInputState, Controller } from "react-gamecube";

export const ControllerLayout: React.FC<{
  value?: string[];
  onChange?: (values: string[]) => void;
}> = (props) => {
  const value = props.value || [];
  const isPressed = (input: ButtonInput) => {
    return value.includes(input);
  };
  const onClick = (input: ButtonInput) => {
    console.log(`${input} was clicked`);
    const filtered = value.filter((i) => i !== input);
    if (!isPressed(input)) {
      // Add button to the list
      filtered.push(input);
    }
    if (props.onChange) {
      props.onChange(filtered);
    }
  };
  return <Controller hideAnalogSticks={true} value={mapButtonStringToControllerValue(value)} onClick={onClick} />;
};

const mapButtonStringToControllerValue = (values: string[]): Partial<ControllerInputState> => {
  const newState: Partial<ControllerInputState> = {};
  for (const v of values) {
    switch (v) {
      case ButtonInput.A:
        newState.a = true;
        break;
      case ButtonInput.D_LEFT:
        newState.dl = true;
        break;
      case ButtonInput.D_RIGHT:
        newState.dr = true;
        break;
      case ButtonInput.D_DOWN:
        newState.dd = true;
        break;
      case ButtonInput.D_UP:
        newState.du = true;
        break;
      case ButtonInput.Z:
        newState.z = true;
        break;
      case ButtonInput.R:
        newState.r = true;
        break;
      case ButtonInput.L:
        newState.l = true;
        break;
      case ButtonInput.B:
        newState.b = true;
        break;
      case ButtonInput.X:
        newState.x = true;
        break;
      case ButtonInput.Y:
        newState.y = true;
        break;
      case ButtonInput.START:
        newState.start = true;
        break;
    }
  }
  return newState;
};
