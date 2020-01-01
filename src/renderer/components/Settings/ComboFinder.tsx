import * as React from "react";

import { shell } from "electron";
import * as path from "path";
import { useDispatch, useSelector } from "react-redux";
import { Button, Checkbox, CheckboxProps, Form, Icon, Input } from "semantic-ui-react";
import { Progress } from "semantic-ui-react";

import { Dispatch, iRootState } from "@/store";

import { fastFindAndWriteCombos } from "@/lib/realtime";
import { notify } from "@/lib/utils";
import { timeDifferenceString } from "common/utils";
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
        const before = new Date();
        const callback = (i: number, total: number, filename: string, n: number): void => {
            dispatch.tempContainer.setPercent(Math.round((i + 1) / total * 100));
            dispatch.tempContainer.setComboLog(`Found ${n} combos in: ${filename}`);
        };
        const numCombos = await fastFindAndWriteCombos(
            filesPath,
            includeSubFolders,
            combosFilePath,
            deleteFilesWithNoCombos,
            callback,
        );
        const after = new Date();
        const timeTakenStr = timeDifferenceString(before, after);
        console.log(`finished generating ${numCombos} combos in ${timeTakenStr}`);
        const message = `Wrote ${numCombos} combos to: ${combosFilePath} in ${timeTakenStr}`;
        dispatch.tempContainer.setComboFinderProcessing(false);
        dispatch.tempContainer.setPercent(100);
        dispatch.tempContainer.setComboLog(message);
        notify(`Combo Processing Complete`, message);
    };
    const findCombos = () => {
        dispatch.tempContainer.setPercent(0);
        dispatch.tempContainer.setComboFinderProcessing(true);
        console.log(`finding combos from the slp files in ${filesPath} ${includeSubFolders && "and all subfolders"} and saving to ${combosFilePath}`);
        findAndWriteCombos().catch(console.error);
    };
    const maybeOpenFile = (fileName: string) => {
        if (!shell.showItemInFolder(fileName)) {
            const parentFolder = path.dirname(fileName);
            shell.openItem(parentFolder);
        }
    };
    const complete = comboFinderPercent === 100;
    const NoMarginIcon = styled(Icon)`
    &&& {
        margin: 0 !important;
    }
    `;
    return (
        <div>
            <h2>Combo Finder</h2>
            <Form>
                <Form.Field>
                    <label>SLP Replay Directory</label>
                    <Input label={<Button onClick={() => shell.openItem(filesPath)}><NoMarginIcon name="folder open outline" /></Button>} value={filesPath} action={<Button onClick={selectPath}>Choose</Button>} />
                </Form.Field>
                <Form.Field>
                    <Checkbox label="Include subfolders" checked={includeSubFolders} onChange={onSubfolder} />
                </Form.Field>
                <Form.Field>
                    <Checkbox label="Delete files with no combos" checked={deleteFilesWithNoCombos} onChange={onSetDeleteFiles} />
                </Form.Field>
                <Form.Field>
                    <label>Output File</label>
                    <Input label={<Button onClick={() => maybeOpenFile(combosFilePath)}><NoMarginIcon name="folder open outline" /></Button>} value={combosFilePath} action={<Button onClick={selectComboPath}>Save as</Button>} />
                </Form.Field>
                <Button primary={true} type="button" onClick={findCombos} disabled={!combosFilePath || comboFinderProcessing}>
                    <Icon name="fast forward" />
                    Process replays
                </Button>
            </Form>
            <div>
                {(comboFinderProcessing || complete) &&
                    <Progress progress={true} percent={comboFinderPercent} success={complete}>{comboFinderLog}</Progress>
                }
            </div>
        </div>
    );
};
