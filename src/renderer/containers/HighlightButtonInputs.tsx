import styled from "@emotion/styled";
import { framesToSeconds, secondsToFrames } from "common/utils";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Accordion, Icon } from "semantic-ui-react";

import { ButtonInput } from "@/components/gamecube/ButtonInput";
import { DelayInput, InlineDropdown } from "@/components/InlineInputs";
import type { Dispatch, iRootState } from "@/store";
import { inputButtonInitialState as defaults } from "@/store/models/inputButtons";

const Outer = styled.div`
  input {
    padding: 3px !important;
  }
`;
const AdvancedOptions = styled.ul`
  margin: 0;
  margin-left: 20px;
  padding: 0 1em;

  li {
    line-height: 25px;
    margin-bottom: 5px;
  }
`;

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

export const HighlightButtonInputs: React.FC = () => {
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
    <Outer>
      <div style={{ marginBottom: "10px", lineHeight: "28px" }}>
        {"Highlight the moment someone "}
        <InlineDropdown value={inputButtonHold} onChange={setInputButtonHold} options={options} />
        {inputButtonHold && (
          <>
            {" for "}
            <span style={{ marginRight: "10px" }}>
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

      <Accordion>
        <Accordion.Title active={showAdvanced} onClick={() => setShowAdvanced(!showAdvanced)}>
          <Icon name="dropdown" />
          {showAdvanced ? "Hide " : "Show "} advanced options
        </Accordion.Title>
        <Accordion.Content active={showAdvanced}>
          <AdvancedOptions>
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
          </AdvancedOptions>
        </Accordion.Content>
      </Accordion>
    </Outer>
  );
};
