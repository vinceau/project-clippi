import React from "react";

import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { InlineDropdown } from "@/components/InlineInputs";
import { FindComboOption } from "@/lib/fileProcessor";
import { ControllerLayout } from "@/components/gamecube/ControllerLayout";
import { ButtonPicker } from "@/components/gamecube/ButtonPicker";
import { ButtonInput } from "@/components/gamecube/ButtonInput";
import { HighlightButtonInputs } from "./HighlightButtonInputs";

export const HighlightOptions: React.FC = () => {
    const [buttons, setButtons] = React.useState<string[]>([]);

    const { comboProfiles } = useSelector((state: iRootState) => state.slippi);
    const dispatch = useDispatch<Dispatch>();
    const { findComboOption, findComboProfile } = useSelector((state: iRootState) => state.filesystem);
    const setFindComboOption = (val: FindComboOption) => dispatch.filesystem.setFindComboOption(val);
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
                    value={findComboOption}
                    onChange={setFindComboOption}
                    options={options}
                />
            </div>
            {findComboOption === FindComboOption.BUTTON_INPUTS ?
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
