/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { iRootState } from "@/store";

import { useTheme } from "@/styles";
import { ButtonInput } from "@/components/gamecube/ButtonInput";
import { DelayInput, InlineDropdown } from "@/components/InlineInputs";
import { Field, Label, Text } from "@/components/Form";
import { StockEvent, InputEvent, ComboEvent, GameEvent } from "@vinceau/slp-realtime";
import { useForm, Controller } from "react-hook-form";
import { Select, Input, Button, Icon, Modal } from "semantic-ui-react";
import { PortSelection } from "@/components/combos/PortSelection";
import { NamedEventConfig } from "@/store/models/automator";

interface FilterValues {
  playerIndex: number[];
  inputButtonHold: string;
  buttonCombo: string[];
  inputButtonHoldDelay: string;
  inputButtonHoldUnits: string;
}

interface FormValues {
  name: string;
  type: string;
  filter: FilterValues;
}

const DEFAULT_FORM_VALUES: FormValues = {
  name: "",
  type: GameEvent.GAME_START,
  filter: {
    playerIndex: [0, 1, 2, 3],
    inputButtonHold: "pressed",
    buttonCombo: [],
    inputButtonHoldDelay: "2",
    inputButtonHoldUnits: "seconds",
  },
};

const eventOptions = [
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
      name: data.name || data.type,
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
  const showPlayerOptions = eventType !== GameEvent.GAME_START && eventType !== GameEvent.GAME_END;
  const showButtonInputs = eventType === InputEvent.BUTTON_COMBO;
  const showComboProfileInput = eventType === ComboEvent.CONVERSION || eventType === ComboEvent.END;

  return (
    <Modal className={theme.themeName} open={opened} closeIcon onClose={closeAction} closeOnDimmerClick={false}>
      <Modal.Header>
        <Controller
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
        {errors.name && <ErrorText>Events must have a unique name</ErrorText>}
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
        {showPlayerOptions && (
          <Field>
            <Label>Match Player</Label>
            <Controller
              as={<PortSelection label="Player" zeroIndex={true} />}
              control={control}
              onChange={([v]) => v}
              defaultValue={[0, 1, 2, 3]}
              rules={{ validate: (val) => val && val.length > 0 }}
              name="filter.playerIndex"
            />
            {errors.filter && errors.filter.playerIndex && (errors.filter.playerIndex as any).type === "validate" && (
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
              name="filter.comboCriteria"
              defaultValue={"$" + currentProfile}
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
