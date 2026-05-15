import React from "react";
import { Button } from "@/ui/Button/Button";
import { Header } from "@/ui/Header/Header";
import { Modal } from "@/ui/Modal/Modal";
import { Check, X } from "lucide-react";

import { useTheme } from "@/styles";

export function TwitchClipClearDialog({ trigger, onClear }: { trigger: React.ReactNode; onClear: () => void }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const onSubmit = React.useCallback(() => {
    setOpen(false);
    onClear();
  }, []);

  return (
    <Modal
      className={theme.themeName}
      closeIcon
      open={open}
      trigger={trigger}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Header icon="trash" content="Delete all Twitch clips" />
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
