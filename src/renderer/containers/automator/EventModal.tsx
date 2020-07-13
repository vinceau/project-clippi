/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import styled from "@emotion/styled";
import { darken, lighten } from "polished";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, iRootState } from "@/store";

import { ThemeMode, useTheme } from "@/styles";
import { ButtonInput } from "@/components/gamecube/ButtonInput";
import { DelayInput, InlineDropdown } from "@/components/InlineInputs";
import { Field, Label, Text } from "@/components/Form";
import { StockEvent, InputEvent, ComboEvent, GameEvent } from "@vinceau/slp-realtime";
import { useForm, Controller } from "react-hook-form";
import { Select, Input, Button, Icon, Modal } from "semantic-ui-react";
import { PortSelection } from "@/components/combos/PortSelection";
import { NamedEventConfig } from "@/store/models/automator";

const countryOptions = [
  { value: GameEvent.GAME_START, text: "Game Start" },
  { value: GameEvent.GAME_END, text: "Game End" },
  { value: StockEvent.PLAYER_SPAWN, text: "Player Spawn" },
  { value: StockEvent.PLAYER_DIED, text: "Player Death" },
  { value: ComboEvent.END, text: "Combo Occurs" },
  { value: ComboEvent.CONVERSION, text: "Conversion Occurs" },
  { value: InputEvent.BUTTON_COMBO, text: "Button Input Combination" },
];

const stringToOptions = (o: string) => ({ key: o, value: o, text: o });

const holdOptions = ["held", "pressed"].map(stringToOptions);
const holdDurationOptions = ["frames", "seconds"].map(stringToOptions);

const ErrorText = styled(Text)`
  color: red;
  font-weight: bold;
`;

export const EventModal: React.FC<{
  onSubmit?: (event: NamedEventConfig) => void;
}> = (props) => {
  const { watch, errors, handleSubmit, control } = useForm();
  const { currentProfile, comboProfiles } = useSelector((state: iRootState) => state.slippi);
  const theme = useTheme();
  const [opened, setOpened] = React.useState<boolean>(false);
  const profileOptions = Object.keys(comboProfiles).map(stringToOptions);
  const onOpen = () => {
    // props value is the true value so reset the state
    setOpened(true);
  };
  const onSubmit = (data: any) => {
    const { eventName, eventType, ...filter } = data;
    const randomCode = Math.random().toString(36).slice(2);
    const event: NamedEventConfig = {
      id: randomCode,
      name: eventName || `${eventType}-${randomCode}`,
      type: eventType,
      filter,
    };
    if (props.onSubmit) {
      props.onSubmit(event);
    }
    console.log(event);
    setOpened(false);
  };
  const watchButtonHold = watch("inputButtonHold", "pressed");
  const watchEventType = watch("eventType", countryOptions[0].value);
  const showPlayerOptions = ![GameEvent.GAME_START, GameEvent.GAME_END].includes(watchEventType);
  const showButtonInputs = watchEventType === InputEvent.BUTTON_COMBO;
  const showComboProfileInput = [ComboEvent.CONVERSION, ComboEvent.END].includes(watchEventType);
  const onSave = () => {
    console.log("save button clicked");
    handleSubmit(onSubmit)();
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
        {showPlayerOptions && (
          <Field>
            <Label>Match Player</Label>
            <Controller
              as={<PortSelection label="Player" zeroIndex={true} />}
              control={control}
              onChange={([v]) => v}
              defaultValue={[0, 1, 2, 3]}
              rules={{ validate: (val) => val && val.length > 0 }}
              name="playerIndex"
            />
            {errors.portFilter && errors.portFilter.type === "validate" && (
              <ErrorText>At least one player must be selected</ErrorText>
            )}
          </Field>
        )}

        {showComboProfileInput && (
          <Field>
            <Label>Combo Profile</Label>
            <Controller
              as={
                <Select
                  css={css`
                    width: 100%;
                  `}
                  placeholder="Combo profile"
                  options={profileOptions}
                />
              }
              control={control}
              onChange={([_, x]) => x.value}
              name="comboCriteria"
              defaultValue={currentProfile}
            />
          </Field>
        )}

        {showButtonInputs && (
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
                    <Controller
                      as={<DelayInput placeholder="2" />}
                      defaultValue="2"
                      onChange={([val]) => val}
                      control={control}
                      name="inputButtonHoldDelay"
                    />
                  </span>
                  <Controller
                    as={<InlineDropdown options={holdDurationOptions} />}
                    defaultValue="seconds"
                    onChange={([val]) => val}
                    control={control}
                    name="inputButtonHoldUnits"
                  />
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
