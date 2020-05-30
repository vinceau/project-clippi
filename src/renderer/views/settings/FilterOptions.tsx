import * as React from "react";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { ComboForm } from "@/components/combos/ComboForm";
import { ProfileSelector } from "@/components/combos/ProfileSelection";
import { FormContainer, PageHeader } from "@/components/Form";
import { ComboConfiguration } from "@/lib/profile";
import { Dispatch, iRootState } from "@/store";
import { DEFAULT_PROFILE } from "@/store/models/slippi";

export const FilterOptions: React.FC = () => {
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
    const notification = (
      <>
        Saved <b>{currentProfile}</b> profile.
      </>
    );
    toast.success(notification, {
      toastId: `${currentProfile}-profile-saved`,
    });
  };
  const setProfile = (profile: string) => {
    dispatch.slippi.setCurrentProfile(profile);
  };
  const onDelete = () => {
    dispatch.slippi.deleteProfile(currentProfile);
    let notification = (
      <>
        Deleted <b>{currentProfile}</b> profile.
      </>
    );
    if (currentProfile === DEFAULT_PROFILE) {
      notification = (
        <>
          Reset <b>{DEFAULT_PROFILE}</b> profile settings.
        </>
      );
    }
    toast.info(notification, {
      toastId: `${currentProfile}-profile-deleted`,
    });
  };
  return (
    <FormContainer>
      <PageHeader>Combo Filter</PageHeader>
      <ProfileSelector initialOptions={profileOptions} value={currentProfile} onChange={setProfile} />
      <ComboForm initialValues={initial} onSubmit={onSubmit} onDelete={onDelete} currentProfile={currentProfile} />
    </FormContainer>
  );
};
