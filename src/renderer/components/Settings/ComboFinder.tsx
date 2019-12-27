import * as React from "react";

import { Line } from "rc-progress";
import { useDispatch, useSelector } from "react-redux";

import { Dispatch, iRootState } from "@/store";

import { generateCombos } from "@/lib/realtime";
import { findFiles } from "common/utils";

export const ComboFinder: React.FC<{}> = () => {
    const [log, setLog] = React.useState<string>("");
    const [processing, setProcessing] = React.useState<boolean>(false);
    const [percent, setPercent] = React.useState<number>(0);
    const { filesPath, combosFilePath, includeSubFolders } = useSelector((state: iRootState) => state.filesystem);
    const dispatch = useDispatch<Dispatch>();
    const selectComboPath = () => {
        dispatch.filesystem.getCombosFilePath();
    };
    const selectPath = () => {
        dispatch.filesystem.getFilesPath();
    };
    const setSubfolders = (folders: boolean) => {
        dispatch.filesystem.setIncludeSubFolders(folders);
    };
    const findAndWriteCombos = async () => {
        const files = await findFiles("*.slp", filesPath, includeSubFolders);
        const callback = (i: number, filename: string, n: number): void => {
            setPercent((i + 1) / files.length * 100);
            setLog(`Found ${n} combos in: ${filename}`);
        };
        const numCombos = await generateCombos(files, combosFilePath, callback);
        setLog(`Wrote ${numCombos} combos to: ${combosFilePath}`);
        setProcessing(false);
    };
    const findCombos = () => {
        setPercent(0);
        setProcessing(true);
        console.log(`finding combos from the slp files in ${filesPath} ${includeSubFolders && "and all subfolders"} and saving to ${combosFilePath}`);
        findAndWriteCombos().catch(console.error);
    };
    return (
        <div>
            <div>
                <span>slp folder: {filesPath}</span>
            </div>
            <div>
                <span>save as: {combosFilePath}</span>
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
                <button onClick={findCombos} disabled={!combosFilePath || processing}>find combos</button>
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
