import * as React from "react";

import { useDispatch, useSelector } from "react-redux";
import { Button, Checkbox, Form, Icon, Progress } from "semantic-ui-react";

import { FileInput } from "@/components/FileInput";
import { InlineDropdown } from "@/components/InlineInputs";
import { ProcessSection } from "@/components/ProcessSection";
import { fileProcessor, FindComboOption, ProcessResult } from "@/lib/fileProcessor";
import { loadFileInDolphin, notify } from "@/lib/utils";
import { openComboInDolphin } from '@/lib/dolphin';

import { Dispatch, iRootState } from "@/store";
import { secondsToString } from "common/utils";
import { RenameFiles } from "./RenameFiles";

const isWindows = process.platform === "win32";

export const ComboFinder: React.FC<{}> = () => {
    const { comboProfiles } = useSelector((state: iRootState) => state.slippi);
    const { comboFinderPercent, comboFinderLog, comboFinderProcessing, recordReplays, obsConnected } = useSelector((state: iRootState) => state.tempContainer);
    const { openCombosWhenDone, filesPath, combosFilePath, includeSubFolders, deleteFilesWithNoCombos,
        renameFiles, findCombos, findComboOption, renameFormat, findComboProfile } = useSelector((state: iRootState) => state.filesystem);
    const dispatch = useDispatch<Dispatch>();
    const setRenameFormat = (format: string) => dispatch.filesystem.setRenameFormat(format);
    const setRenameFiles = (checked: boolean) => dispatch.filesystem.setRenameFiles(checked);
    const setRecordReplays = (checked: boolean) => dispatch.tempContainer.setRecordReplays(checked);
    const setFindCombos = (checked: boolean) => dispatch.filesystem.setFindCombos(checked);
    const setFindComboOption = (val: FindComboOption) => dispatch.filesystem.setFindComboOption(val);
    const setFindComboProfile = (val: string) => dispatch.filesystem.setFindComboProfile(val);
    const onSubfolder = (checked: boolean) => dispatch.filesystem.setIncludeSubFolders(checked);
    const onSetDeleteFiles = (checked: boolean) => dispatch.filesystem.setFileDeletion(checked);
    const onSetOpenCombosWhenDone = (checked: boolean) => dispatch.filesystem.setOpenCombosWhenDone(checked);
    const setCombosFilePath = (p: string) => dispatch.filesystem.setCombosFilePath(p);
    const setFilesPath = (p: string) => dispatch.filesystem.setFilesPath(p);
    const findAndWriteCombos = async () => {
        dispatch.tempContainer.setPercent(0);
        dispatch.tempContainer.setComboFinderProcessing(true);
        console.log(`finding combos from the slp files in ${filesPath} ${includeSubFolders && "and all subfolders"} and saving to ${combosFilePath}`);
        const callback = (i: number, total: number, filename: string, r: ProcessResult): void => {
            dispatch.tempContainer.setPercent(Math.round((i + 1) / total * 100));
            if (findCombos) {
                if (r.fileDeleted) {
                    dispatch.tempContainer.setComboLog(`Deleted ${filename}`);
                } else {
                    dispatch.tempContainer.setComboLog(`Found ${r.numCombos} combos in: ${r.newFilename || filename}`);
                }
            } else if (renameFiles && r.newFilename) {
                dispatch.tempContainer.setComboLog(`Renamed ${filename} to ${r.newFilename}`);
            }
        };
        const result = await fileProcessor.process({
            filesPath,
            includeSubFolders,
            findCombos,
            outputFile: combosFilePath,
            deleteZeroComboFiles: deleteFilesWithNoCombos,
            findComboProfile,
            findComboOption,
            renameTemplate: renameFormat,
            renameFiles,
        }, callback);
        const timeTakenStr = secondsToString(result.timeTaken);
        const numCombos = result.combosFound;
        console.log(`finished generating ${numCombos} combos in ${timeTakenStr}`);
        let message = `Processed ${result.filesProcessed} files in ${timeTakenStr}`;
        if (findCombos) {
            message += ` and wrote ${numCombos} combos to: ${combosFilePath}`;
        }
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
    const processBtnDisabled = (!findCombos && !renameFiles) || !combosFilePath;

    const options = [
        {
            key: "onlyCombos",
            value: FindComboOption.OnlyCombos,
            text: "combos",
        },
        {
            key: "onlyConversions",
            value: FindComboOption.OnlyConversions,
            text: "conversions",
        },
    ];

    const allProfiles = Object.keys(comboProfiles);
    const profileOptions = allProfiles.map(profileName => (
        {
            key: profileName,
            value: profileName,
            text: profileName,
        }
    ));
    if (!allProfiles.includes(findComboProfile)) {
        setFindComboProfile(allProfiles[0]);
    }

    return (
        <div>
            <Form>
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
                    label="Find Combos"
                    open={findCombos}
                    onOpenChange={setFindCombos}
                    disabled={false}
                >
                    <div style={{paddingBottom: "10px"}}>
                        <span>Search replay directory for </span>
                        <InlineDropdown
                            value={findComboOption}
                            onChange={setFindComboOption}
                            options={options}
                        />
                        <span> using the </span>
                        <InlineDropdown
                            value={findComboProfile}
                            onChange={setFindComboProfile}
                            options={profileOptions}
                        />
                        <span> combo profile</span>
                    </div>
                    <Form.Field>
                        <label>Output File</label>
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
                    disabled={false}
                >
                    <RenameFiles value={renameFormat} onChange={setRenameFormat} />
                </ProcessSection>
                <ProcessSection
                    label="Record in OBS"
                    open={recordReplays}
                    onOpenChange={setRecordReplays}
                    disabled={!obsConnected}
                >
                </ProcessSection>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {comboFinderProcessing ?
                        <Button negative={true} type="button" onClick={() => fileProcessor.stop()}>
                            <Icon name="stop" />
                            Stop processing
                    </Button>
                        :
                        <Button primary={true} type="button" onClick={() => findAndWriteCombos().catch(console.error)} disabled={processBtnDisabled}>
                            <Icon name="fast forward" />
                            Process replays
                    </Button>
                    }
                    {isWindows && <Button type="button" onClick={() => loadFileInDolphin().catch(console.error)}>
                        Load a file into Dolphin
                    </Button>}
                </div>
            </Form>
            <div style={{ padding: "10px 0" }}>
                {(comboFinderProcessing || complete) &&
                    <Progress progress={true} percent={comboFinderPercent} success={complete}>{comboFinderLog}</Progress>
                }
            </div>
        </div>
    );
};
