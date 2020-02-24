import React from "react";

import { useHistory } from "react-router-dom";

import { SettingsPage } from "@/containers/Settings/Settings";

export const SettingsView: React.FC = () => {
    const history = useHistory();
    return (
        <SettingsPage showSettings={true} onClose={() => history.push("/")} />
    );
};
