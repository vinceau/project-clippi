import { framesToSeconds, secondsToFrames } from "common/utils";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Accordion } from "@/ui/Accordion/Accordion";

import { ButtonInput } from "@/components/gamecube/ButtonInput";
import { DelayInput, InlineDropdown } from "@/components/InlineInputs";
import type { Dispatch, iRootState } from "@/store";
import { inputButtonInitialState as defaults } from "@/store/models/inputButtons";

import styles from "./HighlightButtonInputs.module.css";

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
const holdOptions = ["frames", "seconds"].map((o) => ({ key: o, value: o, text: o }));

export function HighlightButtonInputs() {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const dispatch = useDispatch<Dispatch>();
  const {
    inputButtonCombo,
    inputButtonPreInputFrames,
    inputButtonPostInputFrames,
    inputButtonHoldAmount,
    inputButtonHoldUnits,
    inputButtonLockoutSecs,
    inputButtonHold,
  } = useSelector((state: iRootState) => state.inputButtons);
  const setInputButtonHold = (val: boolean) => dispatch.inputButtons.setInputButtonHold(val);
  const setInputButtonCombo = (val: string[]) => dispatch.inputButtons.setInputButtonCombo(val);
  const setInputButtonLockoutSecs = (val: string) => dispatch.inputButtons.setInputButtonLockoutSecs(+val);
  const preInputSeconds = framesToSeconds(inputButtonPreInputFrames);
  const postInputSeconds = framesToSeconds(inputButtonPostInputFrames);
  const setHoldAmount = (amount: string) => {
    dispatch.inputButtons.setInputButtonHoldAmount(+amount);
  };
  const setHoldUnits = (units: string) => {
    dispatch.inputButtons.setInputButtonHoldUnits(units);
  };
  const setPreInputSeconds = (secs: string) => {
    const frames = secondsToFrames(+secs);
    dispatch.inputButtons.setInputButtonPreInputFrames(frames);
  };
  const setPostInputSeconds = (secs: string) => {
    const frames = secondsToFrames(+secs);
    dispatch.inputButtons.setInputButtonPostInputFrames(frames);
  };

  return (
    <div className={styles.outer}>
      <div className={styles.inlineWrapper}>
        {"Highlight the moment someone "}
        <InlineDropdown value={inputButtonHold} onChange={setInputButtonHold} options={options} />
        {inputButtonHold && (
          <>
            {" for "}
            <span className={styles.inlineMargin}>
              <DelayInput
                value={inputButtonHoldAmount.toString()}
                onChange={setHoldAmount}
                placeholder={defaults.inputButtonHoldAmount.toString()}
              />
            </span>
            <InlineDropdown value={inputButtonHoldUnits} onChange={setHoldUnits} options={holdOptions} />
          </>
        )}
        {" the combination:"}
      </div>
      <ButtonInput value={inputButtonCombo} onChange={setInputButtonCombo} />

      <Accordion.Root open={showAdvanced} onOpenChange={setShowAdvanced}>
        <Accordion.Trigger>
          {showAdvanced ? "Hide " : "Show "} advanced options
        </Accordion.Trigger>
        <Accordion.Panel>
          <ul className={styles.advancedOptions}>
            <li>
              {"Capture the previous "}{" "}
              <DelayInput
                value={preInputSeconds.toString()}
                onChange={setPreInputSeconds}
                placeholder={framesToSeconds(defaults.inputButtonPreInputFrames).toString()}
              />
              {" seconds and the following "}
              <DelayInput
                value={postInputSeconds.toString()}
                onChange={setPostInputSeconds}
                placeholder={framesToSeconds(defaults.inputButtonPostInputFrames).toString()}
              />
              {" seconds"}
            </li>
            <li>
              {"Wait at least "}{" "}
              <DelayInput
                value={inputButtonLockoutSecs.toString()}
                onChange={setInputButtonLockoutSecs}
                placeholder={defaults.inputButtonLockoutSecs.toString()}
              />
              {" seconds between moments"}
            </li>
          </ul>
        </Accordion.Panel>
      </Accordion.Root>
    </div>
  );
}
