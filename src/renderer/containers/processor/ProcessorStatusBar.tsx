import React from "react";
import styled from "styled-components";

import { iRootState } from "@/store";
import { useSelector } from "react-redux";
import { Button, Icon } from "semantic-ui-react";

import { startProcessing, stopProcessing } from "@/lib/fileProcessor";
import { mapConfigurationToFilterSettings } from "@/lib/profile";
import { ComboFilterSettings, Input } from "@vinceau/slp-realtime";
import { ButtonInputOptions, ComboOptions, FileProcessorOptions, FindComboOption } from "common/fileProcessor";

const isWindows = process.platform === "win32";

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

export const ProcessorStatusBar: React.FC = () => {
    const { comboFinderPercent, comboFinderLog, comboFinderProcessing } = useSelector((state: iRootState) => state.tempContainer);
    const { comboProfiles } = useSelector((state: iRootState) => state.slippi);
    const { openCombosWhenDone, filesPath, combosFilePath, includeSubFolders, deleteFilesWithNoCombos,
        inputButtonCombo, inputButtonPreInputFrames, inputButtonPostInputFrames, inputButtonHoldUnits, inputButtonHoldAmount, inputButtonLockoutSecs, inputButtonHold,
        renameFiles, findCombos, highlightMethod, renameFormat, findComboProfile } = useSelector((state: iRootState) => state.filesystem);

    const complete = comboFinderPercent === 100;
    const processBtnDisabled = (!findCombos && !renameFiles) || !combosFilePath;

    const handleProcessClick = () => {
        console.log(`finding highlights from the slp files in ${filesPath} ${includeSubFolders && "and all subfolders"} and saving to ${combosFilePath}`);

        let converted: Partial<ComboFilterSettings> = {};
        const slippiSettings = comboProfiles[findComboProfile];
        if (slippiSettings) {
            converted = mapConfigurationToFilterSettings(JSON.parse(slippiSettings));
        }

        const inputButtonHoldFrames = inputButtonHoldUnits === "frames" ? inputButtonHoldAmount : inputButtonHoldAmount * 60;
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
            openCombosWhenDone: isWindows && openCombosWhenDone,
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

    return (
        <Outer>
            <ProcessStatus>
                { (comboFinderProcessing || complete) &&
                <>
                    {<PercentDisplay>{comboFinderPercent}%</PercentDisplay>}
                    <div>{comboFinderLog}</div>
                </>
                }
            </ProcessStatus>
            <div>
                {comboFinderProcessing ?
                    <Button negative={true} type="button" onClick={() => stopProcessing()}>
                        <Icon name="stop" />
                            Stop processing
                    </Button>
                    :
                    <Button primary={true} type="button" onClick={handleProcessClick} disabled={processBtnDisabled}>
                        <Icon name="fast forward" />
                            Process replays
                    </Button>
                }
            </div>
        </Outer>
    );
};
