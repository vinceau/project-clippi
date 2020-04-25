import React from "react";

import { Field, FormContainer, PageHeader, Toggle } from "@/components/Form";
import { useTheme, ThemeMode } from "@/styles";

export const Appearance: React.FC = () => {
    const { themeName, toggle } = useTheme();
    const onOpenChange = (darkModeChecked: boolean) => {
        toggle(darkModeChecked ? ThemeMode.DARK : ThemeMode.LIGHT);
    };
    return (
        <FormContainer>
            <PageHeader>Appearance</PageHeader>
            <Field padding="bottom">
                <Toggle
                    value={themeName === ThemeMode.DARK}
                    onChange={onOpenChange}
                    label="Enable Dark Mode"
                />
            </Field>
        </FormContainer>
    );
};
