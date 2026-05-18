import React from "react";
import { Button } from "@/ui/Button/Button";
import { Form } from "@/ui/Form/Form";
import { Input } from "@/ui/Input/Input";
import { Modal } from "@/ui/Modal/Modal";
import { TextArea } from "@/ui/TextArea/TextArea";

import { Confirm } from "@/ui/Confirm/Confirm";
import { Label } from "@/components/Form";
import { useTheme } from "@/styles";

import styles from "./ImportProfileModal.module.css";

type ImportProfileModalProps = {
  open?: boolean;
  existingProfileNames: string[];
  onSubmit: (name: string, profileData: string) => void;
  onDismiss: () => void;
};

export const ImportProfileModal = React.memo(function ImportProfileModal({
  open,
  existingProfileNames,
  onSubmit,
  onDismiss,
}: ImportProfileModalProps) {
  const [shouldConfirm, setShouldConfirm] = React.useState<boolean>(false);
  const [profileName, setProfileName] = React.useState("");
  const [profileData, setProfileData] = React.useState("");
  const theme = useTheme();

  const handleSubmit = React.useCallback(() => {
    setShouldConfirm(false);
    onSubmit(profileName, profileData);
    onDismiss();
  }, [onDismiss, onSubmit, profileData, profileName]);

  const handleSubmitWithNameCheck = React.useCallback(() => {
    if (existingProfileNames.includes(profileName)) {
      setShouldConfirm(true);
    } else {
      handleSubmit();
    }
  }, [existingProfileNames, handleSubmit, profileName]);

  return (
    <Modal title="Import profile" className={theme.themeName} open={open} closeIcon onClose={onDismiss}>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <div style={{ marginBottom: 10 }}>
              <Label>Profile name</Label>
              <Input
                fluid
                placeholder="Profile name"
                value={profileName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileName(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <Label>Profile data</Label>
              <TextArea
                value={profileData}
                placeholder="Profile data"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProfileData(e.target.value)}
              />
            </div>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions className={styles.actions}>
        <Button disabled={!profileName || !profileData} onClick={handleSubmitWithNameCheck}>
          Import
        </Button>
      </Modal.Actions>

      <Confirm
        open={shouldConfirm}
        content="Profile already exists! Overwrite?"
        confirmButton="Continue"
        onCancel={() => setShouldConfirm(false)}
        onConfirm={handleSubmit}
      />
    </Modal>
  );
});
