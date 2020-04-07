import React from "react";

import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { InlineDropdown } from "@/components/InlineInputs";
import { FindComboOption } from "@/lib/fileProcessor";
import { GCButtons } from "@/components/gc-buttons/GCButtons";

export const HighlightOptions: React.FC = () => {
    const { comboProfiles } = useSelector((state: iRootState) => state.slippi);
    const dispatch = useDispatch<Dispatch>();
    const { findComboOption, findComboProfile } = useSelector((state: iRootState) => state.filesystem);
    const setFindComboOption = (val: FindComboOption) => dispatch.filesystem.setFindComboOption(val);
    const setFindComboProfile = (val: string) => dispatch.filesystem.setFindComboProfile(val);
    const options = [
        {
            key: "onlyCombos",
            value: FindComboOption.Combos,
            text: "combos",
        },
        {
            key: "onlyConversions",
            value: FindComboOption.Conversions,
            text: "conversions",
        },
        {
            key: "buttonInputs",
            value: FindComboOption.ButtonInputs,
            text: "input combinations",
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
            <div>
                <span>Search replay directory for </span>
                <InlineDropdown
                    value={findComboOption}
                    onChange={setFindComboOption}
                    options={options}
                />
            </div>
            {findComboOption === FindComboOption.ButtonInputs ?
                <div>
                    Choose a button combo
                    <GCButtons />
                </div> :
                <div>
                    <span> using the </span>
                    <InlineDropdown
                        value={findComboProfile}
                        onChange={setFindComboProfile}
                        options={profileOptions}
                    />
                    <span> combo profile</span>
                </div>
            }
        </div>
    );
};