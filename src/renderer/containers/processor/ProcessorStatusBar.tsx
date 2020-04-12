import path from "path";
import React from "react";

import { openComboInDolphin } from "@/lib/dolphin";
import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon } from "semantic-ui-react";

import { startProcessing, stopProcessing } from "@/lib/fileProcessor";
import { mapConfigurationToFilterSettings } from "@/lib/profile";
import { notify } from "@/lib/utils";
import { ComboFilterSettings, Input } from "@vinceau/slp-realtime";
import { secondsToString } from "common/utils";
import styled from "styled-components";
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
        inputButtonCombo, inputButtonPreInputFrames, inputButtonPostInputFrames, inputButtonHoldFrames, inputButtonLockoutMs, inputButtonHold,
        renameFiles, findCombos, findComboOption, renameFormat, findComboProfile } = useSelector((state: iRootState) => state.filesystem);
    const dispatch = useDispatch<Dispatch>();

    const complete = comboFinderPercent === 100;
    const processBtnDisabled = (!findCombos && !renameFiles) || !combosFilePath;

    const handleProcessClick = () => {
        console.log(`finding highlights from the slp files in ${filesPath} ${includeSubFolders && "and all subfolders"} and saving to ${combosFilePath}`);

        let converted: Partial<ComboFilterSettings> = {};
        const slippiSettings = comboProfiles[findComboProfile];
        if (slippiSettings) {
            converted = mapConfigurationToFilterSettings(JSON.parse(slippiSettings));
        }

        const buttonConfig: ButtonInputOptions = {
            buttonCombo: inputButtonCombo as Input[],
            holdDurationFrames: inputButtonHold ? inputButtonHoldFrames : 1,
            preInputFrames: inputButtonPreInputFrames,
            postInputFrames: inputButtonPostInputFrames,
            captureLockoutMs: inputButtonLockoutMs,
        };

        const comboConfig: ComboOptions = {
            deleteZeroComboFiles: deleteFilesWithNoCombos,
            findComboCriteria: converted,
            openCombosWhenDone: isWindows && openCombosWhenDone,
        };

        const options: FileProcessorOptions = {
            filesPath,
            renameFiles,
            findComboOption: findCombos ? findComboOption : undefined,
            includeSubFolders,
            outputFile: combosFilePath,
            renameTemplate: renameFormat,
            config: findCombos && findComboOption === FindComboOption.BUTTON_INPUTS ? buttonConfig : comboConfig,
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
