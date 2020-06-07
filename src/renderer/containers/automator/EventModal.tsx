/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";

import { Button, Icon, Modal } from "semantic-ui-react";

import { useTheme } from "@/styles";
import { InlineInput } from "@/components/InlineInputs";

export const EventModal: React.FC<{
  value?: string[];
  onChange?: (newButtons: string[]) => void;
}> = (props) => {
  const theme = useTheme();
  const [eventName, setEventName] = React.useState("");
  const [error, setError] = React.useState("");
  const [opened, setOpened] = React.useState<boolean>(false);
  const onOpen = () => {
    // props value is the true value so reset the state
    setError("");
    setEventName("");
    setOpened(true);
  };
  const onReset = () => {};
  const onSave = () => {
    if (!eventName) {
      setError("Please give this event a name");
      return;
    }
    console.log("saving...");
    console.log(`event name is: ${eventName}`);
    // if (props.onChange) {
    //   props.onChange(buttons);
    // }
    setOpened(false);
  };
  return (
    <Modal
      className={theme.themeName}
      open={opened}
      onClose={() => setOpened(false)}
      closeIcon
      trigger={<div onClick={onOpen}>{props.children}</div>}
    >
      <Modal.Header>
        <InlineInput
          css={css`
            width: 100%;
          `}
          placeholder="Event name"
          value={eventName}
          onChange={setEventName}
        />
      </Modal.Header>
      <Modal.Content>
        <div>Some content here</div>
      </Modal.Content>
      <Modal.Actions
        css={css`
          display: flex;
          justify-content: space-between;
          & > button {
            margin: 0 !important;
          }
        `}
      >
        <div>{error && <span>{error}</span>}</div>
        <Button color="green" onClick={onSave}>
          <Icon name="checkmark" /> Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
