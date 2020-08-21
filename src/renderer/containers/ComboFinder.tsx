import * as React from "react";

import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Form, Radio } from "semantic-ui-react";

import { FileInput, MultiFileInput } from "@/components/FileInput";
import { ProcessSection } from "@/components/ProcessSection";

import { Field, FormContainer, Label } from "@/components/Form";
import { RenameFiles } from "@/components/RenameFiles";
import { Dispatch, iRootState } from "@/store";
import { highlightInitialState } from "@/store/models/highlights";
import { HighlightOptions } from "@/containers/HighlightOptions";
import { assertExtension } from "common/utils";

export const ComboFinder: React.FC = () => {
  const {
    openCombosWhenDone,
    includeSubFolders,
    deleteFilesWithNoCombos,
    renameFiles,
    findCombos,
    renameFormat,
    processDirectory,
  } = useSelector((state: iRootState) => state.highlights);
  const { filesPath, combosFilePath } = useSelector((state: iRootState) => state.filesystem);
  const dispatch = useDispatch<Dispatch>();
  const setRenameFormat = (format: string) => dispatch.highlights.setRenameFormat(format);
  const setRenameFiles = (checked: boolean) => dispatch.highlights.setRenameFiles(checked);
  const setFindCombos = (checked: boolean) => dispatch.highlights.setFindCombos(checked);
  const onSubfolder = (checked: boolean) => dispatch.highlights.setIncludeSubFolders(checked);
  const onSetDeleteFiles = (checked: boolean) => dispatch.highlights.setFileDeletion(checked);
  const onSetOpenCombosWhenDone = (checked: boolean) => dispatch.highlights.setOpenCombosWhenDone(checked);
  const setCombosFilePath = (p: string) => {
    const filepath = assertExtension(p, ".json");
    console.log("setting combos path to: " + filepath);
    dispatch.filesystem.setCombosFilePath(filepath);
  };
  const setFilesPath = (p: string[] | string) => dispatch.filesystem.setFilesPath(p);
  const setProcessDirectory = (checked: boolean) => dispatch.highlights.setProcessDirectory(checked);
  const fileFilters = [{ name: "Slippi Replays", extensions: ["slp"] }];
  const fileSelector = processDirectory ? (
    <FileInput
      value={filesPath as string}
      onChange={setFilesPath}
      directory={processDirectory}
      fileTypeFilters={fileFilters}
    />
  ) : (
    <MultiFileInput value={filesPath as string[]} onChange={setFilesPath} fileTypeFilters={fileFilters} />
  );
  return (
    <FormContainer>
      <Form>
        <Field>
          <Label>SLP Replay(s)</Label>
          <div style={{ marginBottom: "10px" }}>{fileSelector}</div>
          <Form.Field>
            <Radio
              label="Select entire directory"
              checked={processDirectory}
              onChange={(_, data) => setProcessDirectory(Boolean(data.checked))}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              label="Select by individual files"
              checked={!processDirectory}
              onChange={(_, data) => setProcessDirectory(!Boolean(data.checked))}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Include subfolders"
              checked={includeSubFolders}
              onChange={(_, data) => onSubfolder(Boolean(data.checked))}
              disabled={!processDirectory}
            />
          </Form.Field>
        </Field>
        <ProcessSection label="Find Highlights" open={findCombos} onOpenChange={setFindCombos}>
          <HighlightOptions />
          <Field>
            <Label>Output File</Label>
            <div style={{ marginBottom: "10px" }}>
              <FileInput
                value={combosFilePath}
                onChange={setCombosFilePath}
                saveFile={true}
                fileTypeFilters={[{ name: "JSON files", extensions: ["json"] }]}
              />
            </div>
            <Form.Field>
              <Checkbox
                label="Delete files with no highlights"
                checked={deleteFilesWithNoCombos}
                onChange={(_, data) => onSetDeleteFiles(Boolean(data.checked))}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                label="Load output file into Dolphin when complete"
                checked={openCombosWhenDone}
                onChange={(_, data) => onSetOpenCombosWhenDone(Boolean(data.checked))}
              />
            </Form.Field>
          </Field>
        </ProcessSection>

        <ProcessSection label="Rename Files" open={renameFiles} onOpenChange={setRenameFiles}>
          <RenameFiles
            value={renameFormat}
            onChange={setRenameFormat}
            placeholder={highlightInitialState.renameFormat}
          />
        </ProcessSection>
      </Form>
    </FormContainer>
  );
};
