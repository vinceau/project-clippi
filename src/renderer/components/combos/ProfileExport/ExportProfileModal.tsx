/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { exists } from "common/utils";
import { clipboard } from "electron";
import React from "react";
import { Button, Form, Modal, TextArea } from "semantic-ui-react";

import { useTheme } from "@/styles";

type ExportProfileModalProps = {
  open?: boolean;
  profileData: string;
  onDismiss: () => void;
};

export const ExportProfileModal = React.memo(function ExportProfileModal({
  open,
  profileData,
  onDismiss,
}: ExportProfileModalProps) {
  const theme = useTheme();
  const timeout = React.useRef<number | undefined>();
  const [copied, setCopied] = React.useState(false);

  const copyProfileToClipboard = React.useCallback(() => {
    if (exists(timeout.current)) {
      clearTimeout(timeout.current);
    }
    setCopied(true);
    timeout.current = (setTimeout(() => setCopied(false), 2000) as unknown) as number;
    clipboard.writeText(profileData);
  }, [profileData, setCopied]);

  return (
    <Modal className={theme.themeName} open={open} closeIcon={true} onClose={onDismiss}>
      <Modal.Header>Export profile</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>Share this profile with your friends!</p>
          <Form>
            <TextArea style={{ minHeight: 300 }} disabled={true} value={profileData} />
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
        <Button onClick={copyProfileToClipboard}>{copied ? "Copied" : "Copy to clipboard"}</Button>
      </Modal.Actions>
    </Modal>
  );
});
