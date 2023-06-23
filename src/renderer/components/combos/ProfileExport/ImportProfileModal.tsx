/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import { Button, Form, Input, Modal, TextArea } from "semantic-ui-react";

import { Confirm } from "@/components/Confirm";
import { Label } from "@/components/Form";
import { useTheme } from "@/styles";

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
    <Modal className={theme.themeName} open={open} closeIcon={true} onClose={onDismiss}>
      <Modal.Header>Import profile</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <div style={{ marginBottom: 10 }}>
              <Label>Profile name</Label>
              <Input
                fluid={true}
                placeholder="Profile name"
                value={profileName}
                onChange={(_: any, { value }: any) => setProfileName(value)}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <Label>Profile data</Label>
              <TextArea
                value={profileData}
                placeholder="Profile data"
                onChange={(_: any, { value }: any) => setProfileData(value)}
              />
            </div>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions
        css={css`
          display: flex;
          justify-content: flex-end;
          & > button {
            margin: 0 !important;
          }
        `}
      >
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
