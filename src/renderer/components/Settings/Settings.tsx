import * as React from "react";

import { useDispatch, useSelector } from "react-redux";

import { Dispatch, iRootState } from "@/store";

import { ComboForm } from "./ComboForm";
import { comboFilter } from "@/lib/realtime";
import { ComboFilterSettings } from "@vinceau/slp-realtime";
import { getFilePath, getFolderPath } from "@/lib/utils";

export const SettingsPage: React.FC<{}> = () => {
    const settings = useSelector((state: iRootState) => state.slippi.settings);
    const initial = comboFilter.updateSettings(JSON.parse(settings));
    const dispatch = useDispatch<Dispatch>();
    const [filePath, setFilePath] = React.useState<string>("");
    const [subfolders, setSubfolders] = React.useState<boolean>(false);
    const [saveComboPath, setSaveComboPath] = React.useState<string>("");
    const selectPath = async () => {
        const p = await getFolderPath();
        setFilePath(p);
    };
    const selectComboPath = async () => {
        const p = await getFilePath(undefined, true);
        setSaveComboPath(p);
    };
    const onSubmit = (values: Partial<ComboFilterSettings>) => {
        const newValues = comboFilter.updateSettings(values);
        console.log(`updated combo filter with new values: ${newValues}`);
        const valueString = JSON.stringify(newValues);
        console.log(`updating redux store: ${valueString}`);
        dispatch.slippi.updateSettings(valueString);
    };
    const findCombos = () => {
        console.log(`finding combos from the slp files in ${filePath} ${subfolders && "and all subfolders"} and saving to ${saveComboPath}`);
    };
    return (
        <div>
            <h1>Settings</h1>
            <div>
<div>
                <span>slp folder: {filePath}</span>
</div>
<div>
                <span>save as: {saveComboPath}</span>
</div>
<div>
include subfolders <input type="checkbox" checked={subfolders} onChange={e => setSubfolders(e.target.checked)} />
</div>
<div>
                <button onClick={selectPath}>select path</button>
</div>
<div>
                <button onClick={selectComboPath}>select combopath</button>
</div>
<div>
                <button onClick={findCombos}>find combos</button>
</div>
            </div>
            <ComboForm initialValues={initial} onSubmit={onSubmit} />
        </div>
    );
};
