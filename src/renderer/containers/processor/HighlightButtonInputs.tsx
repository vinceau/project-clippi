import React from "react";

import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { InlineDropdown, DelayInput } from "@/components/InlineInputs";
import { FindComboOption } from "@/lib/fileProcessor";
import { ControllerLayout } from "@/components/gamecube/ControllerLayout";
import { ButtonPicker } from "@/components/gamecube/ButtonPicker";
import { ButtonInput } from "@/components/gamecube/ButtonInput";
import { framesToSeconds, secondsToFrames, framesToMillis, millisToFrames } from "@/lib/utils";
import styled from "styled-components";

export const HighlightButtonInputs: React.FC = () => {
    const dispatch = useDispatch<Dispatch>();
    const { inputButtonCombo, inputButtonPreInputFrames, inputButtonPostInputFrames, inputButtonHoldFrames,
        inputButtonLockoutMs, inputButtonHold } = useSelector((state: iRootState) => state.filesystem);
    const setInputButtonHold = (val: boolean) => dispatch.filesystem.setInputButtonHold(val);
    const setInputButtonCombo = (val: string[]) => dispatch.filesystem.setInputButtonCombo(val);
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
    return (
        <Outer>
            <div>
                {"Highlight the past "}
                <DelayInput value={preInputSeconds.toString()} onChange={setPreInputSeconds} placeholder={`25`} />
                {" seconds and the following "}
                <DelayInput value={postInputSeconds.toString()} onChange={setPostInputSeconds} placeholder={`5`} />
                {" seconds whenever someone "}
                <InlineDropdown
                    value={inputButtonHold}
                    onChange={setInputButtonHold}
                    options={options}
                />
                {" for "}
                <DelayInput value={holdMs.toString()} onChange={setHoldMillis} placeholder={`250`} />
                {" milliseconds the combination:"}
            </div>
            <ButtonInput value={inputButtonCombo} onChange={setInputButtonCombo} />
        </Outer>
    );
};
