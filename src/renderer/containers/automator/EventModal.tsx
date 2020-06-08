/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import styled from "@emotion/styled";
import { darken, lighten } from "polished";

import { ThemeMode, useTheme } from "@/styles";
import { ButtonInput } from "@/components/gamecube/ButtonInput";
import { DelayInput, InlineDropdown } from "@/components/InlineInputs";
import { Field, Label, Text } from "@/components/Form";
import { StockEvent, InputEvent, ComboEvent, GameEvent } from "@vinceau/slp-realtime";
import { useForm, Controller } from "react-hook-form";
import { Select, Input, Button, Icon, Modal } from "semantic-ui-react";
import { PortSelection } from "@/components/combos/PortSelection";

const countryOptions = [
  { value: GameEvent.GAME_START, text: "Game Start" },
  { value: GameEvent.GAME_END, text: "Game End" },
  { value: StockEvent.PLAYER_SPAWN, text: "Player Spawn" },
  { value: StockEvent.PLAYER_DIED, text: "Player Death" },
  { value: ComboEvent.END, text: "Combo Occurs" },
  { value: ComboEvent.CONVERSION, text: "Conversion Occurs" },
  { value: InputEvent.BUTTON_COMBO, text: "Button Input Combination" },
];

const holdOptions = ["held", "pressed"].map((o) => ({ key: o, value: o, text: o }));
const holdDurationOptions = ["frames", "seconds"].map((o) => ({ key: o, value: o, text: o }));

const ErrorText = styled(Text)`
  color: red;
  font-weight: bold;
`;

export const EventModal: React.FC<{
  value?: string[];
  onChange?: (newButtons: string[]) => void;
}> = (props) => {
  const { watch, errors, handleSubmit, control, getValues } = useForm();
  const formValues = getValues();
  const theme = useTheme();
  const [eventName, setEventName] = React.useState("");
  const [error, setError] = React.useState("");
  const [opened, setOpened] = React.useState<boolean>(false);
  const [inputButtonHold, setInputButtonHold] = React.useState(false);
  const [inputButtonCombo, setInputButtonCombo] = React.useState<string[]>([]);
  const [inputButtonHoldUnits, setHoldUnits] = React.useState<string>("seconds");
  const [inputButtonHoldAmount, setHoldAmount] = React.useState<string>("2");
  const onOpen = () => {
    // props value is the true value so reset the state
    setError("");
    setEventName("");
    setOpened(true);
  };
  const onSubmit = (d: any) => {
    console.log(d);
  };
  const watchButtonHold = watch("inputButtonHold", "pressed");
  const watchEventType = watch("eventType", countryOptions[0].value);
  const hidePlayerOptions = watchEventType === GameEvent.GAME_START || watchEventType === GameEvent.GAME_END;
  const hideButtonInputs = watchEventType !== InputEvent.BUTTON_COMBO;
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
              placeholder="Event Name"
              transparent={true}
            />
          }
          control={control}
          defaultValue=""
          onChange={([_, x]) => {
            console.log("value changed:");
            console.log(x.value);
            return x.value;
          }}
          rules={{ required: true }}
          name="eventName"
        />
        {errors.eventName && <ErrorText>Events must have a unique name</ErrorText>}
      </Modal.Header>
      <Modal.Content>
        <Field padding="bottom">
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
        </Field>
        {!hidePlayerOptions && (
          <Field>
            <Label>Match Player</Label>
            <Controller
              as={<PortSelection label="Player" />}
              control={control}
              onChange={([v]) => v}
              defaultValue={[1, 2, 3, 4]}
              rules={{ validate: (val) => val && val.length > 0 }}
              name="portFilter"
            />
            {errors.portFilter && errors.portFilter.type === "validate" && (
              <ErrorText>At least one player must be selected</ErrorText>
            )}
          </Field>
        )}

        {!hideButtonInputs && (
          <Field>
            <Label>Button Combination</Label>
            <div style={{ marginBottom: "10px", lineHeight: "28px" }}>
              {"Trigger event when the following combination is "}
              <Controller
                as={<InlineDropdown options={holdOptions} />}
                defaultValue="pressed"
                onChange={([x]) => {
                  console.log("value changed");
                  console.log(x);
                  return x;
                }}
                control={control}
                name="inputButtonHold"
              />
              {watchButtonHold === "held" && (
                <span>
                  {" for "}
                  <span style={{ marginRight: "10px" }}>
                    <DelayInput value={inputButtonHoldAmount.toString()} onChange={setHoldAmount} placeholder={`2`} />
                  </span>
                  <InlineDropdown value={inputButtonHoldUnits} onChange={setHoldUnits} options={holdDurationOptions} />
                </span>
              )}
            </div>
            <Controller
              as={<ButtonInput />}
              control={control}
              onChange={([v]) => v}
              defaultValue={[]}
              rules={{ validate: (val) => val && val.length > 0 }}
              name="buttonCombo"
            />
            {errors.buttonCombo && errors.buttonCombo.type === "validate" && (
              <ErrorText>Button combination must be specified</ErrorText>
            )}
          </Field>
        )}
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
        <Button color="green" onClick={onSave}>
          <Icon name="checkmark" /> Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
