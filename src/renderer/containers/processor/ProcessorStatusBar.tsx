import path from "path";
import React from "react";

import { openComboInDolphin } from "@/lib/dolphin";
import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon } from "semantic-ui-react";

import { ButtonInputOptions, ComboOptions, fileProcessor, FileProcessorOptions, FindComboOption, ProcessResult } from "@/lib/fileProcessor";
import { mapConfigurationToFilterSettings } from "@/lib/profile";
import { notify } from "@/lib/utils";
import { ComboFilterSettings, Input } from "@vinceau/slp-realtime";
import { secondsToString } from "common/utils";
import styled from "styled-components";

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

    const findAndWriteCombos = async () => {
        dispatch.tempContainer.setPercent(0);
        dispatch.tempContainer.setComboFinderProcessing(true);
        console.log(`finding highlights from the slp files in ${filesPath} ${includeSubFolders && "and all subfolders"} and saving to ${combosFilePath}`);
        const callback = (i: number, total: number, filename: string, r: ProcessResult): void => {
            dispatch.tempContainer.setPercent(Math.floor((i + 1) / total * 100));
            if (findCombos) {
                if (r.fileDeleted) {
                    dispatch.tempContainer.setComboLog(`Deleted ${filename}`);
                } else {
                    const base = path.basename(r.newFilename || filename);
                    dispatch.tempContainer.setComboLog(`Found ${r.numCombos} highlights in: ${base}`);
                }
            } else if (renameFiles && r.newFilename) {
                dispatch.tempContainer.setComboLog(`Renamed ${filename} to ${r.newFilename}`);
            }
        };

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
        const result = await fileProcessor.process(options, callback);
        const timeTakenStr = secondsToString(result.timeTaken);
        const numCombos = result.combosFound;
        console.log(`finished generating ${numCombos} highlights in ${timeTakenStr}`);
        let message = `Processed ${result.filesProcessed} files in ${timeTakenStr}`;
        if (findCombos) {
            message += ` and found ${numCombos} highlights`;
        }
        dispatch.tempContainer.setComboFinderProcessing(false);
        dispatch.tempContainer.setPercent(100);
        dispatch.tempContainer.setComboLog(message);
        notify(message, `Highlight processing complete`);
        if (isWindows && openCombosWhenDone) {
            // check if we want to open the combo file after generation
            openComboInDolphin(combosFilePath);
        }
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
            </div>
        </Outer>
    );
};
