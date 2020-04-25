import React from "react";

import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { SettingsPage } from "@/containers/settings/Settings";
import { iRootState } from "@/store";

export const SettingsView: React.FC = () => {
    const history = useHistory();
    const { latestPath } = useSelector((state: iRootState) => state.tempContainer);
    const mainPage = latestPath.main || "/";
    return (
        <SettingsPage showSettings={true} onClose={() => history.push(mainPage)} />
    );
};
