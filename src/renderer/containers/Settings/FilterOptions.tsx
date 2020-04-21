
import * as React from "react";

import { useDispatch, useSelector } from "react-redux";

import { ProfileSelector } from "@/components/combos/ProfileSelection";
import { FormContainer, PageHeader } from "@/components/Form";
import { ComboConfiguration } from "@/lib/profile";
import { Dispatch, iRootState } from "@/store";
import { ComboForm } from "./ComboForm/ComboForm";

export const FilterOptions = () => {
    const { currentProfile, comboProfiles } = useSelector((state: iRootState) => state.slippi);
    const profileOptions = Object.keys(comboProfiles);
    const initial: ComboConfiguration = JSON.parse(comboProfiles[currentProfile]);

    const dispatch = useDispatch<Dispatch>();
    const onSubmit = (values: Partial<ComboConfiguration>) => {
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
        <FormContainer>
            <PageHeader>Combo Filter</PageHeader>
            <p>These options determine when the <b>combo occurs</b> and <b>conversion occurs</b> events trigger as well as combos found by the <b>Replay Processor</b>.
            Create new profiles by typing a new profile name in the dropdown below.</p>
            <ProfileSelector initialOptions={profileOptions} value={currentProfile} onChange={setProfile} />
            <ComboForm initialValues={initial} onSubmit={onSubmit} onDelete={onDelete} />
        </FormContainer>
    );
};
