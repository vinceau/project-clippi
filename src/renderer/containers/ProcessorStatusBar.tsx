/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import fs from "fs";
import styled from "@emotion/styled";

import { iRootState } from "@/store";
import { useSelector } from "react-redux";
import { Confirm, Button, Icon } from "semantic-ui-react";

import { startProcessing, stopProcessing } from "@/lib/fileProcessor";
import { mapConfigurationToFilterSettings } from "@/lib/profile";
import { ComboFilterSettings, Input } from "@vinceau/slp-realtime";
import { ButtonInputOptions, ComboOptions, FileProcessorOptions, FindComboOption } from "common/fileProcessor";
import { invalidFilename } from "common/utils";
import { useTheme, modalTheme, ThemeMode } from "@/styles";

const Outer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  z-index: 2;
`;

const ProcessStatus = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const PercentDisplay = styled.div`
  font-size: 20px;
  margin-right: 10px;
`;

const StopButton = styled(Button)`
  &&&:hover {
    background-color: #d01919;
    color: white;
  }
`;

export const ProcessorStatusBar: React.FC = () => {
  const theme = useTheme();
  const [confirmOpened, setConfirmOpened] = React.useState(false);
  const { comboFinderPercent, comboFinderLog, comboFinderProcessing } = useSelector(
    (state: iRootState) => state.tempContainer
  );
  const { comboProfiles } = useSelector((state: iRootState) => state.slippi);
  const {
    includeSubFolders,
    deleteFilesWithNoCombos,
    renameFiles,
    findCombos,
    highlightMethod,
    renameFormat,
    findComboProfile,
  } = useSelector((state: iRootState) => state.highlights);
  const {
    inputButtonCombo,
    inputButtonPreInputFrames,
    inputButtonPostInputFrames,
    inputButtonHoldUnits,
    inputButtonHoldAmount,
    inputButtonLockoutSecs,
    inputButtonHold,
  } = useSelector((state: iRootState) => state.inputButtons);
  const { filesPath, combosFilePath } = useSelector((state: iRootState) => state.filesystem);

  const complete = comboFinderPercent === 100;
  const validButtonCombo =
    !findCombos || highlightMethod !== FindComboOption.BUTTON_INPUTS || inputButtonCombo.length > 0;

  // If we're renaming make sure we have a valid rename format
  const isInvalid = renameFiles && invalidFilename(renameFormat, { allowPaths: true });
  const processBtnDisabled = (!findCombos && !renameFiles) || !combosFilePath || !validButtonCombo || isInvalid;

  const handleProcessClick = () => {
    // Check if the output file already exists
    try {
      if (findCombos && fs.existsSync(combosFilePath)) {
        // Show confirmation dialog
        setConfirmOpened(true);
        return;
      }
    } catch (err) {
      console.error(err);
    }

    // Actually start the processing
    setupOptionsAndProcess();
  };

  const setupOptionsAndProcess = (): void => {
    console.log(
      `finding highlights from the slp files in ${filesPath} ${
        includeSubFolders && "and all subfolders"
      } and saving to ${combosFilePath}`
    );

    let converted: Partial<ComboFilterSettings> = {};
    const slippiSettings = comboProfiles[findComboProfile];
    if (slippiSettings) {
      converted = mapConfigurationToFilterSettings(JSON.parse(slippiSettings));
    }

    const inputButtonHoldFrames =
      inputButtonHoldUnits === "frames" ? inputButtonHoldAmount : inputButtonHoldAmount * 60;
    const buttonConfig: ButtonInputOptions = {
      buttonCombo: inputButtonCombo as Input[],
      holdDurationFrames: inputButtonHold ? Math.ceil(inputButtonHoldFrames) : 1,
      preInputFrames: inputButtonPreInputFrames,
      postInputFrames: inputButtonPostInputFrames,
      captureLockoutMs: inputButtonLockoutSecs * 1000,
    };

    const comboConfig: ComboOptions = {
      deleteZeroComboFiles: deleteFilesWithNoCombos,
      findComboCriteria: converted,
    };

    const options: FileProcessorOptions = {
      filesPath,
      renameFiles,
      findComboOption: findCombos ? highlightMethod : undefined,
      includeSubFolders,
      outputFile: combosFilePath,
      renameTemplate: renameFormat,
      config: findCombos && highlightMethod === FindComboOption.BUTTON_INPUTS ? buttonConfig : comboConfig,
    };
    startProcessing(options);
  };

  const onConfirm = (): void => {
    setConfirmOpened(false);
    setupOptionsAndProcess();
  };

  return (
    <Outer>
      <Confirm
        css={css`
          &&& {
            ${theme.themeName === ThemeMode.DARK && modalTheme(theme.theme)}
            .actions {
              display: flex;
              justify-content: space-between;
              & > button {
                margin: 0 !important;
              }
            }
          }
        `}
        open={confirmOpened}
        content="Output file already exists and will be overwritten. Continue anyway?"
        confirmButton="Continue"
        onCancel={() => setConfirmOpened(false)}
        onConfirm={onConfirm}
      />
      <ProcessStatus>
        {(comboFinderProcessing || complete) && (
          <React.Fragment>
            {<PercentDisplay>{comboFinderPercent}%</PercentDisplay>}
            <div>{comboFinderLog}</div>
          </React.Fragment>
        )}
      </ProcessStatus>
      <div>
        {comboFinderProcessing ? (
          <StopButton type="button" onClick={() => stopProcessing()}>
            <Icon name="stop" />
            Stop processing
          </StopButton>
        ) : (
          <Button primary={true} type="button" onClick={handleProcessClick} disabled={processBtnDisabled}>
            <Icon name="angle double right" style={{ margin: "0", marginRight: "0.3rem" }} /> Process replays
          </Button>
        )}
      </div>
    </Outer>
  );
};
