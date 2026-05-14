import React from "react";
import { Button } from "@/ui/Button/Button";
import { Icon } from "@/ui/Icon/Icon";
import { Modal } from "@/ui/Modal/Modal";

import { generateButtonComboPreview } from "@/lib/inputs";
import { useTheme } from "@/styles";

import { ControllerLayout } from "./ControllerLayout";

import styles from "./ButtonPicker.module.css";

export function ButtonPicker({
  value,
  onChange,
  children,
}: {
  value?: string[];
  onChange?: (newButtons: string[]) => void;
  children?: React.ReactNode;
}) {
  const theme = useTheme();
  const [opened, setOpened] = React.useState<boolean>(false);
  const [buttons, setButtons] = React.useState<string[]>(value || []);
  const onOpen = () => {
    setButtons(value || []);
    setOpened(true);
  };
  const onReset = () => {
    setButtons([]);
  };
  const onSave = () => {
    console.log("saving...");
    if (onChange) {
      onChange(buttons);
    }
    setOpened(false);
  };
  return (
    <Modal
      className={theme.themeName}
      open={opened}
      onClose={() => setOpened(false)}
      closeIcon
      trigger={<div onClick={onOpen}>{children}</div>}
    >
      <Modal.Header>Choose a button combination</Modal.Header>
      <Modal.Content>
        <div>
          <div className={styles.preview}>
            {buttons.length > 0 ? generateButtonComboPreview(buttons) : "No buttons selected"}
          </div>
          <ControllerLayout value={buttons} onChange={setButtons} />
        </div>
      </Modal.Content>
      <Modal.Actions className={styles.actions}>
        <Button disabled={buttons.length === 0} onClick={onReset}>
          <Icon name="undo" /> Reset
        </Button>
        <Button disabled={buttons.length === 0} color="green" onClick={onSave}>
          <Icon name="checkmark" /> Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
