import { AlertDialog } from "@base-ui/react/alert-dialog";
import React from "react";
import styles from "./Confirm.module.css";

/* eslint-disable react/require-default-props */

interface ConfirmProps {
  open?: boolean;
  content?: string;
  confirmButton?: string;
  cancelButton?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export function Confirm({
  open,
  content,
  confirmButton = "OK",
  cancelButton = "Cancel",
  onCancel,
  onConfirm,
}: ConfirmProps) {
  const handleOpenChange = (nextOpen: boolean, eventDetails: { reason: string }) => {
    if (!nextOpen && eventDetails?.reason !== "close-press") {
      onCancel?.();
    }
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={handleOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className={styles.backdrop} />
        <AlertDialog.Popup className={styles.popup}>
          <AlertDialog.Title className={styles.title}>Confirmation</AlertDialog.Title>
          <AlertDialog.Description className={styles.description}>{content}</AlertDialog.Description>
          <div className={styles.actions}>
            <AlertDialog.Close className={styles.cancelButton} onClick={onCancel}>
              {cancelButton}
            </AlertDialog.Close>
            <AlertDialog.Close className={styles.confirmButton} onClick={onConfirm}>
              {confirmButton}
            </AlertDialog.Close>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
