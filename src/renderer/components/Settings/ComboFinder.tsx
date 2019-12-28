import * as React from "react";

import { Icon, Button, Checkbox, Form, CheckboxProps, Input } from 'semantic-ui-react'
import { Progress } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";

import { Dispatch, iRootState } from "@/store";

import { generateCombos } from "@/lib/realtime";
import { notify } from "@/lib/utils";
import { findFiles, openFolder } from "common/utils";
import styled from "styled-components";

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
    const onSubfolder = (_: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        dispatch.filesystem.setIncludeSubFolders(Boolean(data.checked));
    };
    const onSetDeleteFiles = (_: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        dispatch.filesystem.setFileDeletion(Boolean(data.checked));
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
    const open = (dir: string) => {
        openFolder(dir).catch(console.error);
    };
    const complete = comboFinderPercent === 100;
    const ComboFinderContainer = styled.div`
    i.icon {
        margin: 0 !important;
    }
    `;
    return (
        <ComboFinderContainer>
            <Form>
                <Form.Field>
                    <label>SLP Replay Directory</label>
                    <Input label={<Button onClick={() => open(filesPath)}><Icon name="folder open outline" /></Button>} value={filesPath} action={<Button onClick={selectPath}>Choose</Button>} />
                </Form.Field>
                <Form.Field>
                    <label>Output File</label>
                    <Input label={<Button onClick={() => open(combosFilePath)}><Icon name="folder open outline" /></Button>} value={combosFilePath} action={<Button onClick={selectComboPath}>Save as</Button>} />
                </Form.Field>
                <Form.Field>
                    <Checkbox label="Include subfolders" checked={includeSubFolders} onChange={onSubfolder} />
                </Form.Field>
                <Form.Field>
                    <Checkbox label="Delete files with no combos" checked={deleteFilesWithNoCombos} onChange={onSetDeleteFiles} />
                </Form.Field>
                <Button type="submit" onClick={findCombos} disabled={!combosFilePath || comboFinderProcessing}>Process replays</Button>
            </Form>
            <div>
                {(comboFinderProcessing || complete) &&
                    <Progress progress={true} percent={comboFinderPercent} success={complete}>{comboFinderLog}</Progress>
                }
            </div>
        </ComboFinderContainer>
    );
};
