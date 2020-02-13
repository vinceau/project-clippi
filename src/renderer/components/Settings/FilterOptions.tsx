
import * as React from "react";

import { useDispatch, useSelector } from "react-redux";

import { comboFilter } from "@/lib/realtime";
import { Dispatch, iRootState } from "@/store";
import { ComboForm } from "./ComboForm/ComboForm";
import { ProfileSelector } from "./ComboForm/ProfileSelection";
import { mapConfigurationToFilterSettings, ComboConfiguration } from "@/lib/profile";

export const FilterOptions = () => {
    const { currentProfile, comboProfiles } = useSelector((state: iRootState) => state.slippi);
    const profileOptions = Object.keys(comboProfiles);

    let initial = comboFilter.getSettings();
    const slippiSettings = comboProfiles[currentProfile];
    const converted = mapConfigurationToFilterSettings(JSON.parse(slippiSettings));
    if (slippiSettings) {
        initial = comboFilter.updateSettings(converted);
    }
    const dispatch = useDispatch<Dispatch>();
    const onSubmit = (values: Partial<ComboConfiguration>) => {
        // console.log(values);
        const valueString = JSON.stringify(values);
        dispatch.slippi.saveProfile({
            name: currentProfile,
            settings: valueString,
        });
    };
    const setProfile = (profile: string) => {
        dispatch.slippi.setCurrentProfile(profile);
    };
    const onDelete = () => {
        dispatch.slippi.deleteProfile(currentProfile);
    };
    return (
        <div>
            <h2>Combo Filter</h2>
            <p>These options determine when the <b>combo occurs</b> and <b>conversion occurs</b> events trigger as well as the combos that are found by the <b>Replay Processor</b>.</p>
            <ProfileSelector initialOptions={profileOptions} value={currentProfile} onChange={setProfile} />
            <ComboForm initialValues={initial} onSubmit={onSubmit} onDelete={onDelete} />
        </div>
    );
};
