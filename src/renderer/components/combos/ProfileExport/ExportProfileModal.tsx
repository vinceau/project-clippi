import { exists } from "common/utils";
import { clipboard } from "electron";
import React from "react";
import { Button } from "@/ui/Button/Button";
import { Form } from "@/ui/Form/Form";
import { Modal } from "@/ui/Modal/Modal";
import { TextArea } from "@/ui/TextArea/TextArea";

import { useTheme } from "@/styles";

import styles from "./ExportProfileModal.module.css";

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
  const timeout = React.useRef<number | undefined>(undefined);
  const [copied, setCopied] = React.useState(false);

  const copyProfileToClipboard = React.useCallback(() => {
    if (exists(timeout.current)) {
      clearTimeout(timeout.current);
    }
    setCopied(true);
    timeout.current = setTimeout(() => setCopied(false), 2000) as unknown as number;
    clipboard.writeText(profileData);
  }, [profileData, setCopied]);

  return (
    <Modal className={theme.themeName} open={open} closeIcon onClose={onDismiss}>
      <Modal.Header>Export profile</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>Share this profile with your friends!</p>
          <Form>
            <TextArea rows={15} disabled value={profileData} />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions className={styles.actions}>
        <Button onClick={copyProfileToClipboard}>{copied ? "Copied" : "Copy to clipboard"}</Button>
      </Modal.Actions>
    </Modal>
  );
});
