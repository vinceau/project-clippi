/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Button, Icon, Modal, Select } from "semantic-ui-react";

import { PortSelection } from "@/components/combos/PortSelection";
import { Field, Label, Text } from "@/components/Form";
import { ButtonInput } from "@/components/gamecube/ButtonInput";
import { DelayInput, InlineDropdown } from "@/components/InlineInputs";
import { KeywordsInput } from "@/components/KeywordsInput";
import { ComboEvent, GameEvent, InputEvent, StockEvent } from "@/lib/automator_manager";
import type { CustomInputEventFilter } from "@/lib/inputs";
import type { iRootState } from "@/store";
import type { NamedEventConfig } from "@/store/models/automator";
import { useTheme } from "@/styles";

type FilterValues = Required<CustomInputEventFilter>;

interface FormValues {
  name: string;
  type: string;
  filter: FilterValues;
}

const DEFAULT_FORM_VALUES: FormValues = {
  name: "",
  type: InputEvent.BUTTON_COMBO,
  filter: {
    playerNames: [],
    playerIndex: [0, 1, 2, 3],
    playerSelectionOption: "name",
    inputButtonHold: "pressed",
    buttonCombo: [],
    inputButtonHoldDelay: "2",
    inputButtonHoldUnits: "seconds",
  },
};

const eventOptions = [
  { value: InputEvent.BUTTON_COMBO, text: "Button input combination" },
  { value: GameEvent.GAME_START, text: "Game start" },
  { value: GameEvent.GAME_END, text: "Game end" },
  { value: StockEvent.PLAYER_SPAWN, text: "Player spawn" },
  { value: StockEvent.PLAYER_DIED, text: "Player death" },
  { value: ComboEvent.END, text: "Combo occurs" },
  { value: ComboEvent.CONVERSION, text: "Conversion occurs" },
];

const stringToOptions = (o: string) => ({ key: o, value: o, text: o });

const holdOptions = ["held", "pressed"].map(stringToOptions);
const holdDurationOptions = ["frames", "seconds"].map(stringToOptions);
const playerSelectionOptions = ["name", "port"].map(stringToOptions);

const ErrorText = styled(Text)`
  color: red;
  font-weight: bold;
`;

export const EventModal: React.FC<{
  edit?: NamedEventConfig | null;
  opened?: boolean;
  onSubmit?: (event: NamedEventConfig) => void;
  onClose?: () => void;
}> = ({ edit, opened, onClose, onSubmit }) => {
  const defaultValues = Object.assign({}, DEFAULT_FORM_VALUES, edit);
  const { watch, errors, handleSubmit, control, reset } = useForm<FormValues>({ defaultValues });
  const { currentProfile, comboProfiles } = useSelector((state: iRootState) => state.slippi);
  const theme = useTheme();

  // Set current values to be the default values
  React.useLayoutEffect(() => {
    reset(defaultValues);
  }, [edit]);

  // Prefix the value with "$" so we can use the object replacement in the event manager
  const profileOptions = Object.keys(comboProfiles).map((o: string) => ({ key: o, value: "$" + o, text: o }));

  const closeAction = () => {
    if (onClose) {
      onClose();
    }
  };

  const submitAction = (data: FormValues) => {
    const event: NamedEventConfig = {
      ...data,
      id: edit ? edit.id : "",
    };
    if (onSubmit) {
      onSubmit(event);
    }
    console.log(event);
  };

  const saveAction = () => {
    console.log("save button clicked");
    handleSubmit(submitAction)();
  };

  const eventType = watch("type");
  const filter = watch("filter");
  console.log({ filter });
  const showButtonInputs = eventType === InputEvent.BUTTON_COMBO;
  const showComboProfileInput = eventType === ComboEvent.CONVERSION || eventType === ComboEvent.END;
  const headerText = edit === null ? "Create new event" : "Edit event";

  return (
    <Modal className={theme.themeName} open={opened} closeIcon onClose={closeAction} closeOnDimmerClick={false}>
      <Modal.Header>
        {headerText}
        {/* <Controller
          as={
            <Input
              css={css`
                width: 100%;
              `}
              placeholder="Give this event a meaningful name..."
              transparent={true}
            />
          }
          control={control}
          onChange={([_, x]) => {
            console.log("value changed:");
            console.log(x.value);
            return x.value;
          }}
          name="name"
        />
        {errors.name && <ErrorText>Events must have a unique name</ErrorText>} */}
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
                options={eventOptions.map((o) => ({ ...o, key: o.value }))}
              />
            }
            control={control}
            onChange={([_, x]) => {
              console.log("value changed:");
              console.log(x.value);
              return x.value;
            }}
            rules={{ required: true }}
            name="type"
            defaultValue={eventOptions[0].value}
          />
        </Field>

        {showComboProfileInput && (
          <Field padding="bottom">
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
              name="filter.comboCriteria"
              defaultValue={"$" + currentProfile}
            />
          </Field>
        )}

        {showButtonInputs && (
          <Field padding="bottom">
            <Label>Button Combination</Label>
            <div style={{ marginBottom: "10px", lineHeight: "28px" }}>
              {"Trigger event when the following combination is "}
              <Controller
                as={<InlineDropdown options={holdOptions} />}
                onChange={([val]) => val}
                control={control}
                defaultValue={DEFAULT_FORM_VALUES.filter.inputButtonHold}
                name="filter.inputButtonHold"
              />
              {filter.inputButtonHold === "held" && (
                <span>
                  {" for "}
                  <span style={{ marginRight: "10px" }}>
                    <Controller
                      as={<DelayInput placeholder="2" />}
                      onChange={([val]) => val}
                      control={control}
                      defaultValue={DEFAULT_FORM_VALUES.filter.inputButtonHoldDelay}
                      name="filter.inputButtonHoldDelay"
                    />
                  </span>
                  <Controller
                    as={<InlineDropdown options={holdDurationOptions} />}
                    onChange={([val]) => val}
                    control={control}
                    defaultValue={DEFAULT_FORM_VALUES.filter.inputButtonHoldUnits}
                    name="filter.inputButtonHoldUnits"
                  />
                </span>
              )}
            </div>
            <Controller
              as={<ButtonInput />}
              control={control}
              onChange={([v]) => v}
              rules={{
                validate: (val) => (val ? val.length > 0 : false),
              }}
              name="filter.buttonCombo"
            />
            {errors.filter && errors.filter.buttonCombo && (errors.filter.buttonCombo as any).type === "validate" && (
              <ErrorText>Button combination must be specified</ErrorText>
            )}

            <div style={{ marginTop: 10 }}>
              {"Match player by "}
              <Controller
                as={<InlineDropdown options={playerSelectionOptions} />}
                onChange={([val]) => val}
                control={control}
                defaultValue={DEFAULT_FORM_VALUES.filter.playerSelectionOption}
                name="filter.playerSelectionOption"
              />
            </div>
            {filter.playerSelectionOption === "name" && (
              <div style={{ marginTop: 10 }}>
                <Controller
                  as={<KeywordsInput />}
                  control={control}
                  onChange={([v]) => v}
                  rules={{ validate: (val) => val && val.length > 0 }}
                  name="filter.playerNames"
                />
                <Text>
                  Only track inputs by players using these name tags. These can be in-game tags, Slippi display names,
                  or connect codes.
                </Text>
                {errors.filter &&
                  errors.filter.playerNames &&
                  (errors.filter.playerNames as any).type === "validate" && (
                    <ErrorText>Please enter at least one name tag</ErrorText>
                  )}
              </div>
            )}
            {filter.playerSelectionOption === "port" && (
              <div style={{ marginTop: 10 }}>
                <Controller
                  as={<PortSelection label="Player" zeroIndex={true} />}
                  control={control}
                  onChange={([v]) => v}
                  defaultValue={[0, 1, 2, 3]}
                  rules={{ validate: (val) => val && val.length > 0 }}
                  name="filter.playerIndex"
                />
                {errors.filter &&
                  errors.filter.playerIndex &&
                  (errors.filter.playerIndex as any).type === "validate" && (
                    <ErrorText>At least one player must be selected</ErrorText>
                  )}
              </div>
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
        <Button color="green" onClick={saveAction}>
          <Icon name="checkmark" /> Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
