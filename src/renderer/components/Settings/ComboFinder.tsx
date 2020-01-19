import * as React from "react";

import styled from "styled-components";

import { useDispatch, useSelector } from "react-redux";
import { Button, Checkbox, CheckboxProps, Form, Icon, TextArea } from "semantic-ui-react";
import { Progress } from "semantic-ui-react";

import { FileProcessor } from "@/lib/fileProcessor";
import { loadFileInDolphin, notify, openComboInDolphin } from "@/lib/utils";
import { Dispatch, iRootState } from "@/store";
import { secondsToString } from "common/utils";
import { FileInput } from "../Misc/Misc";
import { ProcessSection } from "../Misc/ProcessSection";
import { TemplatePreview } from "../Misc/TemplatePreview";

const isWindows = process.platform === "win32";

export const ComboFinder: React.FC<{}> = () => {
    const { comboFinderPercent, comboFinderLog, comboFinderProcessing } = useSelector((state: iRootState) => state.tempContainer);
    const { openCombosWhenDone, filesPath, combosFilePath, includeSubFolders, deleteFilesWithNoCombos,
        renameFiles, findCombos } = useSelector((state: iRootState) => state.filesystem);
    const [msg, setMsg] = React.useState("");
    const dispatch = useDispatch<Dispatch>();
    const setRenameFiles = (checked: boolean) => {
        dispatch.filesystem.setRenameFiles(checked);
    };
    const setFindCombos = (checked: boolean) => {
        dispatch.filesystem.setFindCombos(checked);
    };
    const onSubfolder = (checked: boolean) => {
        dispatch.filesystem.setIncludeSubFolders(checked);
    };
    const onSetDeleteFiles = (checked: boolean) => {
        dispatch.filesystem.setFileDeletion(checked);
    };
    const onSetOpenCombosWhenDone = (checked: boolean) => {
        dispatch.filesystem.setOpenCombosWhenDone(checked);
    };
    const findAndWriteCombos = async () => {
        dispatch.tempContainer.setPercent(0);
        dispatch.tempContainer.setComboFinderProcessing(true);
        console.log(`finding combos from the slp files in ${filesPath} ${includeSubFolders && "and all subfolders"} and saving to ${combosFilePath}`);
        const callback = (i: number, total: number, filename: string, n: number): void => {
            dispatch.tempContainer.setPercent(Math.round((i + 1) / total * 100));
            dispatch.tempContainer.setComboLog(`Found ${n} combos in: ${filename}`);
        };
        const fileProcessor = new FileProcessor(filesPath, includeSubFolders);
        const result = await fileProcessor.process({
            findCombos,
            outputFile: combosFilePath,
            deleteZeroComboFiles: deleteFilesWithNoCombos,
            renameTemplate: msg,
            renameFiles,
        }, callback);
        const timeTakenStr = secondsToString(result.timeTaken);
        const numCombos = result.combosFound;
        console.log(`finished generating ${numCombos} combos in ${timeTakenStr}`);
        const message = `Processed ${result.filesProcessed} files in ${timeTakenStr} and wrote ${numCombos} combos to: ${combosFilePath}`;
        dispatch.tempContainer.setComboFinderProcessing(false);
        dispatch.tempContainer.setPercent(100);
        dispatch.tempContainer.setComboLog(message);
        notify(message, `Combo Processing Complete`);
        if (isWindows && openCombosWhenDone) {
            // check if we want to open the combo file after generation
            openComboInDolphin(combosFilePath);
        }
    };
    const complete = comboFinderPercent === 100;
    const Buttons = styled.div`
    display: flex;
    justify-content: space-between;
    `;
    const setCombosFilePath = (p: string) => {
        dispatch.filesystem.setCombosFilePath(p);
    };
    const setFilesPath = (p: string) => {
        dispatch.filesystem.setFilesPath(p);
    };
    const processBtnDisabled = (!findCombos && !renameFiles) || !combosFilePath || comboFinderProcessing;
    return (
        <div>
            <Form>
                <h2>Replay Processor</h2>
                <Form.Field>
                    <label>SLP Replay Directory</label>
                    <FileInput
                        value={filesPath}
                        onChange={setFilesPath}
                        directory={true}
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        label="Include subfolders"
                        checked={includeSubFolders}
                        onChange={(_, data) => onSubfolder(Boolean(data.checked))}
                    />
                </Form.Field>
                <ProcessSection
                   label="Combo Finder"
                   open={findCombos}
                   onOpenChange={setFindCombos}
>
                <Form.Field>
                    <label>Write combos to the following file:</label>
                    <FileInput
                        value={combosFilePath}
                        onChange={setCombosFilePath}
                        saveFile={true}
                        fileTypeFilters={[
                            { name: "JSON files", extensions: ["json"] }
                        ]}
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        label="Delete files with no combos"
                        checked={deleteFilesWithNoCombos}
                        onChange={(_, data) => onSetDeleteFiles(Boolean(data.checked))}
                    />
                </Form.Field>
                {isWindows && <Form.Field>
                    <Checkbox
                        label="Load output file into Dolphin when complete"
                        checked={openCombosWhenDone}
                        onChange={(_, data) => onSetOpenCombosWhenDone(Boolean(data.checked))}
                    />
                </Form.Field>}
                </ProcessSection>

                <ProcessSection
                    label="Rename Files"
                    open={renameFiles}
                    onOpenChange={setRenameFiles}
                >
                    <Form.Field>
                        <label>Format</label>
                        <div style={{ paddingBottom: "5px" }}>
                            <TextArea
                                value={msg}
                                onChange={(_: any, {value}: any) => setMsg(value)}
                            />
                            <TemplatePreview template={msg} />
                        </div>
                    </Form.Field>
                </ProcessSection>

                <Buttons>
                    <Button primary={true} type="button" onClick={() => findAndWriteCombos().catch(console.error)} disabled={processBtnDisabled}>
                        <Icon name="fast forward" />
                        Process replays
                    </Button>
                    {isWindows && <Button type="button" onClick={() => loadFileInDolphin().catch(console.error)}>
                        Load a file into Dolphin
                    </Button>}
                </Buttons>
            </Form>
            <div style={{ padding: "10px 0" }}>
                {(comboFinderProcessing || complete) &&
                    <Progress progress={true} percent={comboFinderPercent} success={complete}>{comboFinderLog}</Progress>
                }
            </div>
        </div >
    );
};
