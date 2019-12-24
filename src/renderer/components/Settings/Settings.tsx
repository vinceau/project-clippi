import * as React from "react";

import { useDispatch, useSelector } from "react-redux";

import { Dispatch, iRootState } from "@/store";

import { ComboForm } from "./ComboForm";
import { comboFilter } from "@/lib/realtime";
import { ComboFilterSettings } from "@vinceau/slp-realtime";

export const SettingsPage: React.FC<{}> = () => {
    const settings = useSelector((state: iRootState) => state.slippi.settings);
    const initial = comboFilter.updateSettings(JSON.parse(settings));
    const dispatch = useDispatch<Dispatch>();
    const onSubmit = (values: Partial<ComboFilterSettings>) => {
        const newValues = comboFilter.updateSettings(values);
        console.log(`updated combo filter with new values: ${newValues}`);
        const valueString = JSON.stringify(newValues);
        console.log(`updating redux store: ${valueString}`);
        dispatch.slippi.updateSettings(valueString);
    };
    return (
        <div>
            <h1>Settings</h1>
            <ComboForm initialValues={initial} onSubmit={onSubmit} />
        </div>
    );
};
