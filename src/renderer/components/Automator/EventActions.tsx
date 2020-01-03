import * as React from "react";

import styled, { css } from "styled-components";

import { ActionEvent } from "@/lib/realtime";
import { Action as ActionDefinition } from "@vinceau/event-actions";
import { Action } from "@vinceau/event-actions";
import { produce } from "immer";
import { Container, Icon, List, Divider } from "semantic-ui-react";
import { InlineDropdown } from "../InlineInputs";
import { Labelled } from "../Misc";
import { ActionInput, AddActionInput } from "./ActionInputs";

import { generateRandomEvent } from "@/lib/events";
import { isDevelopment } from "@/lib/utils";
import { CodeBlock } from "../Misc";

const allEvents: ActionEvent[] = [
  ActionEvent.GAME_START,
  ActionEvent.GAME_END,
  ActionEvent.PLAYER_DIED,
  ActionEvent.PLAYER_SPAWN,
  ActionEvent.COMBO_OCCURRED,
];

if (isDevelopment) {
  allEvents.push(ActionEvent.TEST_EVENT);
}

const mapEventToName: { [eventName: string]: string } = {
  [ActionEvent.GAME_START]: "a new game starts",
  [ActionEvent.GAME_END]: "the game ends",
  [ActionEvent.PLAYER_DIED]: "a player dies",
  [ActionEvent.PLAYER_SPAWN]: "a player spawns",
  [ActionEvent.COMBO_OCCURRED]: "a combo occurs",
  [ActionEvent.TEST_EVENT]: "a test event occurs",
};

/*
  {
    event: string;
    actions: [
      {
        name: string;
        transform?: boolean;
        args?: any;
      }
    ];
  }
*/

const EventHeader = styled.div`
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const EventActions = (props: any) => {
  const { value, onChange, onRemove, disabledOptions } = props;
  // const [notifyValue, setValue] = React.useState({});
  const onEventChange = (newEvent: string) => {
    const newValue = produce(value, (draft: any) => {
      draft.event = newEvent;
    });
    onChange(newValue);
  };
  const onActionChange = (index: number, newAction: Action) => {
    const newValue = produce(value, (draft: any) => {
      draft.actions[index] = newAction;
    });
    onChange(newValue);
  };
  const onActionRemove = (index: number) => {
    const newValue = produce(value, (draft: any) => {
      draft.actions.splice(index, 1);
    });
    onChange(newValue);
  };
  const disabledActions = value.actions.map((a: ActionDefinition) => a.name);
  const onActionAdd = (action: string) => {
    const newValue = produce(value, (draft: any) => {
      draft.actions.push({
        name: action,
        args: {},
      });
    });
    onChange(newValue);
  };

  return (
    <Container>
      <EventHeader>
        <InlineDropdown
          prefix="When"
          options={allEvents}
          mapOptionToLabel={(opt: string) => mapEventToName[opt]}
          fontSize={30}
          value={value.event}
          onChange={onEventChange}
          disabledOptions={disabledOptions}
        />
        <Labelled onClick={onRemove} title="Remove"><Icon name="remove" size="big" /></Labelled>
      </EventHeader>
      <List divided>
        {value.actions.map((a: Action, i: number) => {
          const onInnerActionChange = (newVal: Action) => {
            onActionChange(i, newVal);
          };
          const prefix = i === 0 ? "Then " : "And ";
          return (
            <ActionInput
              key={`${value.name}--${a.name}`}
              selectPrefix={prefix}
              value={a}
              onChange={onInnerActionChange}
              disabledActions={disabledActions}
              onRemove={() => onActionRemove(i)}
            />
          );
        })}
        <AddActionInput onChange={onActionAdd} disabledActions={disabledActions} />
      </List>
      <CodeBlock values={value} />
      <Divider />
    </Container>
  );
};

export const AddEventDropdown = (props: any) => {
  const { onChange, disabledOptions } = props;
  const unusedOptions = allEvents.filter(a => !disabledOptions.includes(a));
  const addText = generateRandomEvent();
  const shouldShow = css`
      ${unusedOptions.length === 0 && "display: none;"}
  `;
  const CustomContainer = styled(Container)`
  &&& {
      ${shouldShow}
  }
  `;
  return (
    <CustomContainer>
      <EventHeader>
        <InlineDropdown
          prefix="When"
          text={addText}
          selectOnBlur={false}
          onChange={onChange}
          options={unusedOptions}
          mapOptionToLabel={(opt: string) => mapEventToName[opt]}
          fontSize={30}
        />
      </EventHeader>
    </CustomContainer>
  );
};
