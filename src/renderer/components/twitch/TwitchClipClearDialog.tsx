import React from "react";
import { Button } from "@/ui/Button/Button";
import { Modal } from "@/ui/Modal/Modal";
import { Check, X } from "lucide-react";

import { useTheme } from "@/styles";

export function TwitchClipClearDialog({
  trigger,
  triggerClassName,
  onClear,
}: {
  trigger: React.ReactNode;
  triggerClassName?: string;
  onClear: () => void;
}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const onSubmit = React.useCallback(() => {
    setOpen(false);
    onClear();
  }, []);

  return (
    <Modal
      title="Delete all Twitch clips?"
      className={theme.themeName}
      closeIcon
      open={open}
      trigger={trigger}
      triggerClassName={triggerClassName}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Modal.Content>
        <p>You are about to delete all saved Twitch clips. This cannot be undone.</p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>
          <X size={16} /> Cancel
        </Button>
        <Button color="green" onClick={onSubmit}>
          <Check size={16} /> Delete
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
