import React from "react";

import { InlineDropdown } from "@/components/InlineInputs";
import { Dispatch, iRootState } from "@/store";
import { FindComboOption } from "common/fileProcessor";
import { useDispatch, useSelector } from "react-redux";
import { HighlightButtonInputs } from "./HighlightButtonInputs";

export const HighlightOptions: React.FC = () => {
    const { comboProfiles } = useSelector((state: iRootState) => state.slippi);
    const dispatch = useDispatch<Dispatch>();
    const { highlightMethod, findComboProfile } = useSelector((state: iRootState) => state.filesystem);
    const setHighlightMethod = (val: FindComboOption) => dispatch.filesystem.setHighlightMethod(val);
    const setFindComboProfile = (val: string) => dispatch.filesystem.setFindComboProfile(val);
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
    const profileOptions = allProfiles.map(profileName => (
        {
            key: profileName,
            value: profileName,
            text: profileName,
        }
    ));
    if (!allProfiles.includes(findComboProfile)) {
        setFindComboProfile(allProfiles[0]);
    }

    return (
        <div style={{ paddingBottom: "10px" }}>
            <div style={{ marginBottom: "10px" }}>
                <span>Search replay directory for </span>
                <InlineDropdown
                    value={highlightMethod}
                    onChange={setHighlightMethod}
                    options={options}
                />
            </div>
            {highlightMethod === FindComboOption.BUTTON_INPUTS ?
                <HighlightButtonInputs />
                :
                <div>
                    {"Highlight combos matching the "}
                    <InlineDropdown
                        value={findComboProfile}
                        onChange={setFindComboProfile}
                        options={profileOptions}
                    />
                    {" combo profile"}
                </div>
            }
        </div>
    );
};
