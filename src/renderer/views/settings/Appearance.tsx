import React from "react";

import { Field, FormContainer, PageHeader, Toggle } from "@/components/Form";
import { useTheme } from "@/styles";

export const Appearance: React.FC = () => {
    const { themeName, toggle } = useTheme();
    const onOpenChange = (darkModeChecked: boolean) => {
        toggle(darkModeChecked ? "dark" : "light");
    };
    return (
        <FormContainer>
            <PageHeader>Appearance</PageHeader>
            <Field>
                <Toggle
                    value={themeName === "dark"}
                    onChange={onOpenChange}
                    label="Enable Dark Theme"
                />
            </Field>
        </FormContainer>
    );
};
