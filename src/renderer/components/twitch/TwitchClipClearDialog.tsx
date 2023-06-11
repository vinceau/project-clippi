import React from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

import { useTheme } from "@/styles";

export const TwitchClipClearDialog = ({ trigger, onClear }: { trigger: React.ReactNode; onClear: () => void }) => {
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
          <Icon name="remove" /> Cancel
        </Button>
        <Button color="green" onClick={onSubmit}>
          <Icon name="checkmark" /> Delete
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
