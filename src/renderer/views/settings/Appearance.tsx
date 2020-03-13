import React from "react";
import { Checkbox } from "semantic-ui-react";

import { useTheme } from "@/styles";

export const Appearance: React.FC = () => {
    const { themeName, toggle } = useTheme();
    const onOpenChange = (darkModeChecked: boolean) => {
        toggle(darkModeChecked ? "dark" : "light");
    };
    return (
        <div>
            <h2>Appearance</h2>
            <Checkbox
                checked={themeName === "dark"}
                onChange={(_, data) => onOpenChange(Boolean(data.checked))}
                label="Use Dark Theme"
                toggle={true}
            />
        </div>
    );
};
