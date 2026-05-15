import { Dialog } from "@base-ui/react/dialog";
import { clsx } from "clsx";
import { X } from "lucide-react";
import React from "react";
import styles from "./Modal.module.css";

/* eslint-disable react/require-default-props */

interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  closeIcon?: boolean;
  closeOnDimmerClick?: boolean;
  trigger?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

/* eslint-disable react/require-default-props */
export function Modal({
  open,
  onClose,
  onOpen,
  closeIcon,
  closeOnDimmerClick,
  trigger,
  className,
  children,
}: ModalProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={handleOpenChange}
      modal
      disablePointerDismissal={closeOnDimmerClick === false}
    >
      {trigger && (
        <Dialog.Trigger className={styles.trigger} nativeButton={false}>
          {trigger}
        </Dialog.Trigger>
      )}
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={clsx(styles.popup, className)}>
          {closeIcon && (
            <Dialog.Close className={styles.closeIcon}>
              <X size={16} />
            </Dialog.Close>
          )}
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const ModalHeader = Dialog.Title;
export function ModalContent({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={clsx(styles.content, className)}>{children}</div>;
}
export function ModalActions({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={clsx(styles.actions, className)}>{children}</div>;
}
export function ModalDescription({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={clsx(styles.description, className)}>{children}</div>;
}

Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Actions = ModalActions;
Modal.Description = ModalDescription;
