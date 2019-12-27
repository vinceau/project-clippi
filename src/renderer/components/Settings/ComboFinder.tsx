import * as React from "react";

import { Line } from "rc-progress";
import { useDispatch, useSelector } from "react-redux";

import { Dispatch, iRootState } from "@/store";

import { generateCombos } from "@/lib/realtime";
import { getFilePath } from "@/lib/utils";
import { findFiles } from "common/utils";

export const ComboFinder: React.FC<{}> = () => {
    const [log, setLog] = React.useState<string>("");
    const [processing, setProcessing] = React.useState<boolean>(false);
    const [percent, setPercent] = React.useState<number>(0);
    const { filesPath, includeSubFolders } = useSelector((state: iRootState) => state.filesystem);
    const dispatch = useDispatch<Dispatch>();
    const [saveComboPath, setSaveComboPath] = React.useState<string>("");
    const selectPath = () => {
        dispatch.filesystem.getFilesPath();
    };
    const selectComboPath = () => {
        getFilePath(undefined, true).then(p => setSaveComboPath(p)).catch(console.error);
    };
    const setSubfolders = (folders: boolean) => {
        dispatch.filesystem.setIncludeSubFolders(folders);
    };
    const findAndWriteCombos = async () => {
        const files = await findFiles("*.slp", filesPath, includeSubFolders);
        const callback = (i: number, filename: string, n: number): void => {
            setPercent(i / (files.length - 1) * 100);
            setLog(`Found ${n} combos in: ${filename}`);
        };
        const numCombos = await generateCombos(files, saveComboPath, callback);
        setLog(`Wrote ${numCombos} combos to: ${saveComboPath}`);
        reset();
    };
    const reset = () => {
        setSaveComboPath("");
        setProcessing(false);
    };
    const findCombos = () => {
        setPercent(0);
        setProcessing(true);
        console.log(`finding combos from the slp files in ${filesPath} ${includeSubFolders && "and all subfolders"} and saving to ${saveComboPath}`);
        findAndWriteCombos().catch(console.error);
    };
    return (
        <div>
            <div>
                <span>slp folder: {filesPath}</span>
            </div>
            <div>
                <span>save as: {saveComboPath}</span>
            </div>
            <div>
                include subfolders <input type="checkbox" checked={includeSubFolders} onChange={e => setSubfolders(e.target.checked)} />
            </div>
            <div>
                <button onClick={selectPath}>select path</button>
            </div>
            <div>
                <button onClick={selectComboPath}>select combopath</button>
            </div>
            <div>
                <button onClick={findCombos} disabled={!saveComboPath || processing}>find combos</button>
            </div>
            <div>
                <p>{log}</p>
            </div>
            <div>
                <Line percent={percent} strokeWidth={4} />
            </div>
        </div>
    );
};
