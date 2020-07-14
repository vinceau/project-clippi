import * as React from "react";

import { Action as ActionDefinition } from "@vinceau/event-actions";
import { Action } from "@vinceau/event-actions";
import { produce } from "immer";
import { Divider, Icon, List } from "semantic-ui-react";
import styled from "@emotion/styled";

import { CodeBlock } from "@/components/CodeBlock";
import { InlineDropdown } from "@/components/InlineInputs";
import { Labelled } from "@/components/Labelled";
import { actionComponents, EventActionConfig } from "@/containers/actions";
import { generateRandomEvent } from "@/lib/events";
import { ActionInput, AddActionInput } from "./ActionInputs";

/*
const allEvents: ActionEvent[] = [
  ActionEvent.GAME_START,
  ActionEvent.GAME_END,
  ActionEvent.PLAYER_DIED,
  ActionEvent.PLAYER_SPAWN,
  ActionEvent.COMBO_OCCURRED,
  ActionEvent.CONVERSION_OCCURRED,
];

const mapEventToName: { [eventName: string]: string } = {
  [ActionEvent.GAME_START]: "a new game starts",
  [ActionEvent.GAME_END]: "the game ends",
  [ActionEvent.PLAYER_DIED]: "a player dies",
  [ActionEvent.PLAYER_SPAWN]: "a player spawns",
  [ActionEvent.COMBO_OCCURRED]: "a combo occurs",
  [ActionEvent.CONVERSION_OCCURRED]: "a conversion occurs",
};
*/

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

const EventHeader = styled.h2`
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const EventHeaderButtons = styled.div`
  & > span {
    padding: 5px;
  }
`;

export const EventActions: React.FC<{
  disabledOptions: string[];
  value: EventActionConfig;
  onChange: (e: EventActionConfig) => void;
  onRemove: () => void;
}> = (props) => {
  const { value, onChange, onRemove, disabledOptions } = props;
  // const [notifyValue, setValue] = React.useState({});
  const onEventChange = (newEvent: string) => {
    const newValue = produce(value, (draft: EventActionConfig) => {
      draft.event = newEvent;
    });
    onChange(newValue);
  };
  const onActionChange = (index: number, newAction: Action) => {
    const newValue = produce(value, (draft: EventActionConfig) => {
      draft.actions[index] = newAction;
    });
    onChange(newValue);
  };
  const onActionRemove = (index: number) => {
    const newValue = produce(value, (draft: EventActionConfig) => {
      draft.actions.splice(index, 1);
    });
    onChange(newValue);
  };
  const disabledActions = value.actions.map((a: ActionDefinition) => a.name);
  const onActionAdd = (action: string) => {
    const params = actionComponents[action].defaultParams;
    const newValue = produce(value, (draft: any) => {
      draft.actions.push({
        name: action,
        args: params ? params() : {},
      });
    });
    onChange(newValue);
  };

  return (
    <div>
      <EventHeader>
        <InlineDropdown
          prefix="When"
          customOptions={allEvents}
          mapOptionToLabel={(opt: string) => mapEventToName[opt]}
          fontSize={30}
          value={value.event}
          onChange={onEventChange}
          disabledOptions={disabledOptions}
        />
        <EventHeaderButtons>
          <Labelled onClick={() => testRunActions(value.event, value.actions)} title="Test run">
            <Icon name="play" />
          </Labelled>
          <Labelled onClick={onRemove} title="Remove">
            <Icon name="remove" />
          </Labelled>
        </EventHeaderButtons>
      </EventHeader>
      <List divided>
        {value.actions.map((a: Action, i: number) => {
          const onInnerActionChange = (newVal: Action) => {
            onActionChange(i, newVal);
          };
          const prefix = i === 0 ? "Then " : "And ";
          return (
            <ActionInput
              key={`${value.event}--${a.name}`}
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
    </div>
  );
};

export const AddEventDropdown: React.FC<{
  onChange: any;
  disabledOptions: any[];
}> = (props) => {
  const { onChange, disabledOptions } = props;
  const unusedOptions = allEvents.filter((a) => !disabledOptions.includes(a));
  const addText = generateRandomEvent();
  const CustomContainer = styled.div`
    ${unusedOptions.length === 0 && "display: none;"}
  `;
  return (
    <CustomContainer>
      <EventHeader>
        <InlineDropdown
          prefix="When"
          text={addText}
          selectOnBlur={false}
          onChange={onChange}
          customOptions={unusedOptions}
          mapOptionToLabel={(opt: string) => mapEventToName[opt]}
          fontSize={30}
        />
      </EventHeader>
    </CustomContainer>
  );
};
