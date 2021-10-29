import { FindComboOption } from "common/fileProcessor";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Hint } from "@/components/Hint";
import { InlineDropdown } from "@/components/InlineInputs";
import type { Dispatch, iRootState } from "@/store";

import { HighlightButtonInputs } from "./HighlightButtonInputs";

const highlightLabels = {
  [FindComboOption.COMBOS]: "combos",
  [FindComboOption.CONVERSIONS]: "conversions",
};

const highlightHints = {
  [FindComboOption.COMBOS]:
    "Stricter conversions, requiring the opponent to be hit again within 45 frames after hit-stun ends",
  [FindComboOption.CONVERSIONS]: "Requires the opponent to be hit again within 45 frames of touching the ground",
};

export const HighlightOptions: React.FC = () => {
  const { comboProfiles } = useSelector((state: iRootState) => state.slippi);
  const dispatch = useDispatch<Dispatch>();
  const { highlightMethod, findComboProfile } = useSelector((state: iRootState) => state.highlights);
  const setHighlightMethod = (val: FindComboOption) => dispatch.highlights.setHighlightMethod(val);
  const setFindComboProfile = (val: string) => dispatch.highlights.setFindComboProfile(val);
  const options = [
    {
      key: "onlyCombos",
      value: FindComboOption.COMBOS,
      text: "combos",
    },
    {
      key: "onlyConversions",
      value: FindComboOption.CONVERSIONS,
      text: "conversions",
    },
    {
      key: "buttonInputs",
      value: FindComboOption.BUTTON_INPUTS,
      text: "button combinations",
    },
  ];
  const allProfiles = Object.keys(comboProfiles);
  const profileOptions = allProfiles.map((profileName) => ({
    key: profileName,
    value: profileName,
    text: profileName,
  }));
  if (!allProfiles.includes(findComboProfile)) {
    setFindComboProfile(allProfiles[0]);
  }
  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <span>Search replay directory for </span>
        <InlineDropdown value={highlightMethod} onChange={setHighlightMethod} options={options} />
      </div>
      {highlightMethod === FindComboOption.BUTTON_INPUTS ? (
        <HighlightButtonInputs />
      ) : (
        <div>
          {"Highlight "}
          <Hint text={highlightHints[highlightMethod]}>{highlightLabels[highlightMethod]}</Hint>
          {" matching the "}
          <InlineDropdown value={findComboProfile} onChange={setFindComboProfile} options={profileOptions} />
          {" combo profile"}
        </div>
      )}
    </div>
  );
};
