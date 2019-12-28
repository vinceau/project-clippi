import * as React from "react";

import { Progress } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";

import { Dispatch, iRootState } from "@/store";

import { generateCombos } from "@/lib/realtime";
import { notify } from "@/lib/utils";
import { findFiles } from "common/utils";

export const ComboFinder: React.FC<{}> = () => {
    const { comboFinderPercent, comboFinderLog, comboFinderProcessing } = useSelector((state: iRootState) => state.tempContainer);
    const { filesPath, combosFilePath, includeSubFolders, deleteFilesWithNoCombos } = useSelector((state: iRootState) => state.filesystem);
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
    const setDeleteFiles = (folders: boolean) => {
        dispatch.filesystem.setFileDeletion(folders);
    };
    const findAndWriteCombos = async () => {
        const files = await findFiles("*.slp", filesPath, includeSubFolders);
        const callback = (i: number, filename: string, n: number): void => {
            dispatch.tempContainer.setPercent(Math.round((i + 1) / files.length * 100));
            dispatch.tempContainer.setComboLog(`Found ${n} combos in: ${filename}`);
        };
        const numCombos = await generateCombos(files, combosFilePath, deleteFilesWithNoCombos, callback);
        const message = `Wrote ${numCombos} combos to: ${combosFilePath}`;
        dispatch.tempContainer.setComboLog(message);
        notify("Combo Processing Complete", message);
        dispatch.tempContainer.setComboFinderProcessing(false);
    };
    const findCombos = () => {
        dispatch.tempContainer.setPercent(0);
        dispatch.tempContainer.setComboFinderProcessing(true);
        console.log(`finding combos from the slp files in ${filesPath} ${includeSubFolders && "and all subfolders"} and saving to ${combosFilePath}`);
        findAndWriteCombos().catch(console.error);
    };
    const complete = comboFinderPercent === 100;
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
                delete files with no combos <input type="checkbox" checked={deleteFilesWithNoCombos} onChange={e => setDeleteFiles(e.target.checked)} />
            </div>
            <div>
                <button onClick={selectPath}>select path</button>
            </div>
            <div>
                <button onClick={selectComboPath}>select combopath</button>
            </div>
            <div>
                <button onClick={findCombos} disabled={!combosFilePath || comboFinderProcessing}>find combos</button>
            </div>
            <div>
                <p>{comboFinderLog}</p>
            </div>
            <div>
                {(comboFinderProcessing || complete) &&
                    <Progress progress={true} percent={comboFinderPercent} success={complete} />
                }
            </div>
        </div>
    );
};
