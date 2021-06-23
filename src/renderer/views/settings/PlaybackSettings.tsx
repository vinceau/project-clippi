import React from "react";

import { FileInput } from "@/components/FileInput";

import { Field, FormContainer, Label, PageHeader, Text, Toggle } from "@/components/Form";
import { getDolphinExecutableNames, getDolphinPath } from "@/lib/dolphin";
import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

import { Labelled } from "@/components/Labelled";
import { IS_MAC_OR_WIN } from "common/constants";
import styled from "@emotion/styled";

const DolphinPathLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ResetButton = styled.span`
  font-size: 1.2rem;
  opacity: 0.8;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const defaultDolphinPath = getDolphinPath();
const dolphinExecNames = getDolphinExecutableNames();

const PlaybackExecutableNames: React.FC = () => {
  const elements: React.ReactNode[] = [];
  dolphinExecNames.forEach((el, i) => {
    if (i > 0 && i === dolphinExecNames.length - 1) {
      // This is the last element
      elements.push(<> or </>);
    }
    elements.push(<i>{el}</i>);
    if (i < dolphinExecNames.length - 2) {
      // If have more than one element left to come
      elements.push(<>, </>);
    }
  });
  return React.createElement(React.Fragment, null, ...elements);
};

export const PlaybackSettings: React.FC = () => {
  const dispatch = useDispatch<Dispatch>();
  const { meleeIsoPath, dolphinPath } = useSelector((state: iRootState) => state.filesystem);
  const showDevOptions = useSelector((state: iRootState) => state.appContainer.showDevOptions);
  const autoNameRecordedFiles = useSelector((state: iRootState) => state.appContainer.autoNameRecordedFiles);
  const setMeleeIsoPath = (filePath: string) => dispatch.filesystem.setMeleeIsoPath(filePath);
  const setDolphinPath = (filePath: string) => dispatch.filesystem.setDolphinPath(filePath);
  const resetDolphinPath = () => dispatch.filesystem.setDolphinPath(defaultDolphinPath);
  const setAutoNameRecordedFiles = () => dispatch.appContainer.setAutoNameRecordedFiles(!autoNameRecordedFiles);
  const showDolphinPathField = showDevOptions || !IS_MAC_OR_WIN;
  const showResetButton = showDolphinPathField && dolphinPath !== defaultDolphinPath;
  return (
    <FormContainer>
      <PageHeader>Playback</PageHeader>
      <Field padding="bottom">
        <Label>Melee ISO File</Label>
        <FileInput value={meleeIsoPath} onChange={setMeleeIsoPath} />
        <Text>
          The path to an NTSC Melee 1.02 ISO. Dolphin will auto-launch this title when playing back replays. This file
          should match the Melee ISO File in the Slippi Launcher.
        </Text>
      </Field>

      {showDolphinPathField && (
        <Field padding="bottom">
          <DolphinPathLabel>
            <Label>Playback Dolphin Path</Label>
            {showResetButton && (
              <Labelled title="Restore default value">
                <ResetButton onClick={resetDolphinPath}>Reset</ResetButton>
              </Labelled>
            )}
          </DolphinPathLabel>
          <FileInput value={dolphinPath} directory={true} onChange={setDolphinPath} />
          <Text>
            The folder containing the <PlaybackExecutableNames /> playback executable. Do NOT modify this unless you're
            using Linux or you <i>really</i> know what you're doing. This path should match the Playback Dolphin Path in
            the Slippi Launcher.
          </Text>
        </Field>
      )}

      <Field border="top">
        <Toggle
          value={autoNameRecordedFiles}
          onChange={setAutoNameRecordedFiles}
          label="Auto-name Recorded Files (experimental)"
        />
        <Text>
          If enabled, games that are recorded separately will have their video file named to match the SLP filename.
          Restoration of the original OBS filename format is NOT guaranteed. Use at own risk.
        </Text>
      </Field>
    </FormContainer>
  );
};
