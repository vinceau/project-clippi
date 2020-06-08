/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import styled from "@emotion/styled";
import { darken, lighten } from "polished";

import { ThemeMode, useTheme } from "@/styles";
import { Field, Label, Text } from "@/components/Form";
import { StockEvent, InputEvent, ComboEvent, GameEvent } from "@vinceau/slp-realtime";
import { useForm, Controller } from "react-hook-form";
import { Select, Input, Button, Icon, Modal } from "semantic-ui-react";
import { PortSelection } from "@/components/combos/PortSelection";

const countryOptions = [
  { value: GameEvent.GAME_START, text: "Game start" },
  { value: GameEvent.GAME_END, text: "Game end" },
  { value: StockEvent.PLAYER_SPAWN, text: "Player spawn" },
  { value: StockEvent.PLAYER_DIED, text: "Player death" },
  { value: ComboEvent.END, text: "Combo occurs" },
  { value: ComboEvent.CONVERSION, text: "Conversion occurs" },
  { value: InputEvent.BUTTON_COMBO, text: "Button combination input" },
];

export const EventModal: React.FC<{
  value?: string[];
  onChange?: (newButtons: string[]) => void;
}> = (props) => {
  const { errors, handleSubmit, control } = useForm();
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
  const onSubmit = (d: any) => {
    console.log(d);
  };
  const onReset = () => {};
  const onSave = () => {
    console.log("save button clicked");
    handleSubmit(onSubmit)();
    /*
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
    */
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
        <Controller
          as={
            <Input
              css={css`
                width: 100%;
              `}
              defaultValue=""
              placeholder="Event Name"
              transparent={true}
            />
          }
          control={control}
          onChange={([_, x]) => {
            console.log("value changed:");
            console.log(x.value);
            return x.value;
          }}
          rules={{ required: true }}
          name="eventName"
        />
        {errors.eventName && <span>This is a required field</span>}
      </Modal.Header>
      <Modal.Content>
        <Field padding="bottom" border="bottom">
          <Label>Event Type</Label>
          <Controller
            as={
              <Select
                css={css`
                  width: 100%;
                `}
                placeholder="Choose an event"
                options={countryOptions.map((o) => ({ ...o, key: o.value }))}
              />
            }
            control={control}
            onChange={([_, x]) => {
              console.log("value changed:");
              console.log(x.value);
              return x.value;
            }}
            rules={{ required: true }}
            name="eventType"
            defaultValue={countryOptions[0].value}
          />
          <Text>
            Combo profiles are used to determine the combo and conversion events as well as the combos found by the{" "}
            <b>Replay Processor</b>. You can create new profiles by typing a new profile name in the dropdown.
          </Text>
        </Field>
        <Field>
          <Label>Port Filter</Label>
          <Controller
            as={<PortSelection />}
            control={control}
            onChange={([x]) => {
              console.log("value changed:");
              console.log(JSON.stringify(x));
              return x;
            }}
            defaultValue={[1, 2, 3, 4]}
            rules={{ validate: (val) => val && val.length > 0 }}
            name="portFilter"
          />
          <Text>Only match the event for players using these ports.</Text>
        </Field>

        {errors.portFilter && errors.portFilter.type === "validate" && (
          <span>At least one port has to be selected</span>
        )}
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
