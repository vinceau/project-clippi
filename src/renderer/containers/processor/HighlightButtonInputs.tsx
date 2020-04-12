import React from "react";

import { ButtonInput } from "@/components/gamecube/ButtonInput";
import { DelayInput, InlineDropdown } from "@/components/InlineInputs";
import { framesToMillis, framesToSeconds, millisToFrames, secondsToFrames } from "@/lib/utils";
import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Accordion, Icon } from "semantic-ui-react";
import styled from "styled-components";

export const HighlightButtonInputs: React.FC = () => {
    const [showAdvanced, setShowAdvanced] = React.useState(false);
    const dispatch = useDispatch<Dispatch>();
    const { inputButtonCombo, inputButtonPreInputFrames, inputButtonPostInputFrames, inputButtonHoldFrames,
        inputButtonLockoutMs, inputButtonHold } = useSelector((state: iRootState) => state.filesystem);
    const setInputButtonHold = (val: boolean) => dispatch.filesystem.setInputButtonHold(val);
    const setInputButtonCombo = (val: string[]) => dispatch.filesystem.setInputButtonCombo(val);
    const setInputButtonLockoutMs = (val: string) => dispatch.filesystem.setInputButtonLockoutMs(+val);
    const holdMs = Math.ceil(framesToMillis(inputButtonHoldFrames));
    const preInputSeconds = framesToSeconds(inputButtonPreInputFrames);
    const postInputSeconds = framesToSeconds(inputButtonPostInputFrames);
    const setHoldMillis = (ms: string) => {
        const frames = millisToFrames(+ms);
        dispatch.filesystem.setInputButtonHoldFrames(frames);
    };
    const setPreInputSeconds = (secs: string) => {
        const frames = secondsToFrames(+secs);
        dispatch.filesystem.setInputButtonPreInputFrames(frames);
    };
    const setPostInputSeconds = (secs: string) => {
        const frames = secondsToFrames(+secs);
        dispatch.filesystem.setInputButtonPostInputFrames(frames);
    };
    const options = [
        {
            key: "hold",
            value: true,
            text: "holds",
        },
        {
            key: "press",
            value: false,
            text: "presses",
        },
    ];
    const Outer = styled.div`
    padding-bottom: 10px;
    input {
        padding: 3px !important;
    }
    `;
    const AdvancedOptions = styled.ul`
    margin: 0;
    margin-left: 20px;
    padding: 0 1em;

    li {
        margin-bottom: 5px;
    }
    `;
    return (
        <Outer>
            <div style={{ marginBottom: "10px", lineHeight: "24px" }}>
                {"Highlight the moment someone "}
                <InlineDropdown
                    value={inputButtonHold}
                    onChange={setInputButtonHold}
                    options={options}
                />
                {inputButtonHold && <>
                    {" for "}
                    <DelayInput value={holdMs.toString()} onChange={setHoldMillis} placeholder={`250`} />
                    {" milliseconds"}
                </>}
                {" the combination:"}
            </div>
            <ButtonInput value={inputButtonCombo} onChange={setInputButtonCombo} />

            <Accordion>
                <Accordion.Title active={showAdvanced} onClick={() => setShowAdvanced(!showAdvanced)}>
                    <Icon name="dropdown" />
                    {showAdvanced ? "Hide " : "Show "} advanced options
            </Accordion.Title>
                <Accordion.Content active={showAdvanced}>
                    <AdvancedOptions>
                        <li>
                            {"Capture the previous "} <DelayInput value={preInputSeconds.toString()} onChange={setPreInputSeconds} placeholder={`25`} />
                            {" seconds and the following "}
                            <DelayInput value={postInputSeconds.toString()} onChange={setPostInputSeconds} placeholder={`5`} />
                            {" seconds"}
                        </li>
                        <li>
                            {"Wait at least "} <DelayInput value={inputButtonLockoutMs.toString()} onChange={setInputButtonLockoutMs} placeholder={`5000`} />
                            {" milliseconds between moments"}
                        </li>
                    </AdvancedOptions>
                </Accordion.Content>
            </Accordion>
        </Outer>
    );
};
