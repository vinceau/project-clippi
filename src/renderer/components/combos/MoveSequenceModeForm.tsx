import React from "react";
import { Field } from "react-final-form";
import { Button } from "semantic-ui-react";

import { ThemeMode, useTheme } from "@/styles";

type MoveSequenceMode = "include" | "start" | "end" | "exact";

const MoveSequenceModeButton = ({
  type,
  currentValue,
  onChange,
  children,
}: React.PropsWithChildren<{
  type: MoveSequenceMode;
  currentValue: MoveSequenceMode;
  onChange: (mode: MoveSequenceMode) => void;
}>) => {
  const theme = useTheme();
  const isSelected = currentValue === type;
  return (
    <Button
      type="button"
      inverted={theme.themeName === ThemeMode.DARK}
      primary={isSelected}
      onClick={() => onChange(type)}
    >
      {children}
    </Button>
  );
};

export const MoveSequenceModeForm = ({
  value = "include",
  onChange,
}: {
  value?: MoveSequenceMode;
  onChange: (value: MoveSequenceMode) => void;
}) => {
  return (
    <Button.Group>
      <MoveSequenceModeButton type="include" currentValue={value} onChange={onChange}>
        Includes
      </MoveSequenceModeButton>
      <MoveSequenceModeButton type="start" currentValue={value} onChange={onChange}>
        Start
      </MoveSequenceModeButton>
      <MoveSequenceModeButton type="end" currentValue={value} onChange={onChange}>
        Ends
      </MoveSequenceModeButton>
      <MoveSequenceModeButton type="exact" currentValue={value} onChange={onChange}>
        Exact
      </MoveSequenceModeButton>
    </Button.Group>
  );
};

export const MoveSequenceModeFormAdapter = (props: any) => {
  const { name, ...rest } = props;
  return (
    <Field name={name}>
      {(fprops) => {
        const { input, ...frest } = fprops;
        return <MoveSequenceModeForm {...rest} {...frest} {...input} />;
      }}
    </Field>
  );
};
