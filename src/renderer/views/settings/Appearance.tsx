import React from "react";

import { Field, FormContainer, PageHeader } from "@/components/Form";
import { Toggle } from "@/ui/Toggle/Toggle";
import { ThemeMode, useTheme } from "@/styles";

export const Appearance: React.FC = () => {
  const { themeName, toggle } = useTheme();
  const onOpenChange = (darkModeChecked: boolean) => {
    toggle(darkModeChecked ? ThemeMode.DARK : ThemeMode.LIGHT);
  };
  return (
    <FormContainer>
      <PageHeader>Appearance</PageHeader>
      <Field padding="bottom">
        <Toggle value={themeName === ThemeMode.DARK} onChange={onOpenChange} label="Enable Dark Mode" />
      </Field>
    </FormContainer>
  );
};
