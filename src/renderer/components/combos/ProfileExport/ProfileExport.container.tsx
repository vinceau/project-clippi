import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import type { Dispatch, iRootState } from "@/store";

import { ExportProfileModal } from "./ExportProfileModal";
import { ImportProfileModal } from "./ImportProfileModal";
import { ProfileExport } from "./ProfileExport";

type ModalOptions = "import" | "export";

export const ProfileExportContainer = React.memo(function ProfileExportContainer({
  currentProfileData,
}: {
  currentProfileData: string;
}) {
  const { comboProfiles } = useSelector((state: iRootState) => state.slippi);
  const [modal, setModal] = React.useState<ModalOptions | undefined>();
  const profileNames = React.useMemo(() => {
    return Object.keys(comboProfiles);
  }, [comboProfiles]);

  const dispatch = useDispatch<Dispatch>();

  const onDismiss = React.useCallback(() => setModal(undefined), []);

  const onProfileImport = React.useCallback(
    (name: string, settings: string) => {
      dispatch.slippi.importProfile({ name, settings });
      toast.info(
        <>
          <b>{name}</b> profile imported
        </>,
        {
          toastId: `${name}-profile-imported`,
        }
      );
    },
    [dispatch.slippi]
  );

  return (
    <>
      <ProfileExport onImport={() => setModal("import")} onExport={() => setModal("export")} />
      <ImportProfileModal
        open={modal === "import"}
        existingProfileNames={profileNames}
        onDismiss={onDismiss}
        onSubmit={onProfileImport}
      />
      <ExportProfileModal open={modal === "export"} profileData={currentProfileData} onDismiss={onDismiss} />
    </>
  );
});
