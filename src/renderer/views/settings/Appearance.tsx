import React from "react";

import { useTheme } from "@/styles";
import { PageHeader, Field, Toggle } from "@/components/Form";

export const Appearance: React.FC = () => {
    const { themeName, toggle } = useTheme();
    const onOpenChange = (darkModeChecked: boolean) => {
        toggle(darkModeChecked ? "dark" : "light");
    };
    return (
        <div style={{maxWidth: "800px"}}>
            <PageHeader>Appearance</PageHeader>
            <Field>
                <Toggle
                    value={themeName === "dark"}
                    onChange={onOpenChange}
                    label="Enable Dark Theme"
                />
            </Field>
        </div>
    );
};
