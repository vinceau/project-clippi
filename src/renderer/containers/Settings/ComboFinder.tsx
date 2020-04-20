import * as React from "react";

import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Form } from "semantic-ui-react";

import { FileInput } from "@/components/FileInput";
import { ProcessSection } from "@/components/ProcessSection";

import { Dispatch, iRootState } from "@/store";
import { HighlightOptions } from "../processor/HighlightOptions";
import { RenameFiles } from "./RenameFiles";

const isWindows = process.platform === "win32";

export const ComboFinder: React.FC = () => {
    const { openCombosWhenDone, includeSubFolders, deleteFilesWithNoCombos,
        renameFiles, findCombos, renameFormat } = useSelector((state: iRootState) => state.highlights);
    const { filesPath, combosFilePath } = useSelector((state: iRootState) => state.filesystem);
    const dispatch = useDispatch<Dispatch>();
    const setRenameFormat = (format: string) => dispatch.highlights.setRenameFormat(format);
    const setRenameFiles = (checked: boolean) => dispatch.highlights.setRenameFiles(checked);
    const setFindCombos = (checked: boolean) => dispatch.highlights.setFindCombos(checked);
    const onSubfolder = (checked: boolean) => dispatch.highlights.setIncludeSubFolders(checked);
    const onSetDeleteFiles = (checked: boolean) => dispatch.highlights.setFileDeletion(checked);
    const onSetOpenCombosWhenDone = (checked: boolean) => dispatch.highlights.setOpenCombosWhenDone(checked);
    const setCombosFilePath = (p: string) => dispatch.filesystem.setCombosFilePath(p);
    const setFilesPath = (p: string) => dispatch.filesystem.setFilesPath(p);
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
                    label="Find Highlights"
                    open={findCombos}
                    onOpenChange={setFindCombos}
                >
                    <HighlightOptions />
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
                            label="Delete files with no highlights"
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
                    <RenameFiles value={renameFormat} onChange={setRenameFormat} />
                </ProcessSection>
            </Form>
        </div>
    );
};
