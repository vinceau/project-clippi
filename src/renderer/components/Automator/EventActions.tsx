import * as React from "react";

import styled from "styled-components";

import { ActionEvent } from "@/lib/realtime";
import { Container, Dropdown, Item } from "semantic-ui-react";
import { ActionInput, NotifyInput } from "./ActionInputs";
import { produce } from "immer";
import { Action } from "@vinceau/event-actions";
import { InlineDropdown } from "../InlineInputs";

const allEvents: ActionEvent[] = [
  ActionEvent.GAME_START,
  ActionEvent.GAME_END,
  ActionEvent.PLAYER_DIED,
  ActionEvent.PLAYER_SPAWN,
  ActionEvent.COMBO_OCCURRED,
  ActionEvent.TEST_EVENT,
];

const mapEventToName: { [eventName: string]: string } = {
  [ActionEvent.GAME_START]: "a new game starts",
  [ActionEvent.GAME_END]: "the game ends",
  [ActionEvent.PLAYER_DIED]: "someone dies",
  [ActionEvent.PLAYER_SPAWN]: "someone spawns",
  [ActionEvent.COMBO_OCCURRED]: "a combo occurs",
  [ActionEvent.TEST_EVENT]: "a test event occurs",
};

const EventSelector: React.FC<{
  value: ActionEvent,
  onChange: (e: string) => void;
  disabledEvents?: string[];
}> = props => {
  return (
      <InlineDropdown
        prefix="When"
        options={allEvents}
        value={props.value}
        mapOptionToLabel={(opt: string) => mapEventToName[opt]}
        onChange={props.onChange}
        disabledOptions={props.disabledEvents}
        fontSize={30}
      />
  );
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
export const EventActions = (props: any) => {
  const { value, onChange, disabledEvents, ...rest } = props;
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
  const disabledActions = value.actions.map(a => a.name);
  return (
    <Container>
      <EventSelector value={value.event} onChange={onEventChange} disabledEvents={disabledEvents} />
      <Item.Group divided>
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
            />
          )
        })}
        {/* <NotifyInput value={notifyValue} onChange={setValue} /> */}
      </Item.Group>
      <pre>{(JSON as any).stringify(value, 0, 2)}</pre>
    </Container>
  );
};
