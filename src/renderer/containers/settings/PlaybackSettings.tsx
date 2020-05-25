import React from "react";

import { FileInput } from "@/components/FileInput";

import { Field, FormContainer, Label, PageHeader, Text } from "@/components/Form";
import { getDolphinExecutableName, getDolphinPath } from "@/lib/dolphin";
import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

import { Labelled } from "@/components/Labelled";
import { isMacOrWindows } from "common/utils";
import styled from "styled-components";

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

export const PlaybackSettings: React.FC = () => {
  const dispatch = useDispatch<Dispatch>();
  const { meleeIsoPath, dolphinPath } = useSelector((state: iRootState) => state.filesystem);
  const { isDev } = useSelector((state: iRootState) => state.appContainer);
  const setMeleeIsoPath = (filePath: string) => dispatch.filesystem.setMeleeIsoPath(filePath);
  const setDolphinPath = (filePath: string) => dispatch.filesystem.setDolphinPath(filePath);
  const resetDolphinPath = () => dispatch.filesystem.setDolphinPath(defaultDolphinPath);
  const showDolphinPathField = isDev || !isMacOrWindows;
  const showResetButton = showDolphinPathField && dolphinPath !== defaultDolphinPath;
  return (
    <FormContainer>
      <PageHeader>Playback</PageHeader>
      <Field padding="bottom">
        <Label>Melee ISO File</Label>
        <FileInput value={meleeIsoPath} onChange={setMeleeIsoPath} />
        <Text>
          The path to an NTSC Melee 1.02 ISO. Dolphin will auto-launch this title when playing back replays. This file
          should match the Melee ISO File in the Slippi Desktop App.
        </Text>
      </Field>
      {showDolphinPathField && (
        <Field border="top">
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
            The folder containing the <b>{getDolphinExecutableName()}</b> playback executable. Do NOT modify this unless
            you're using Linux or you <i>really</i> know what you're doing. This path should match the Playback Dolphin
            Path in the Slippi Desktop App.
          </Text>
        </Field>
      )}
    </FormContainer>
  );
};
