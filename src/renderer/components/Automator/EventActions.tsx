import * as React from "react";

import styled from "styled-components";

import { Container, Item, Dropdown } from "semantic-ui-react";
import { ActionInput, NotifyInput } from "./ActionInputs";
import { ActionEvent } from "@/lib/realtime";


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

const generateOptions = (events: string[], disabledEvents?: string[]): Array<{ key: string; text: string; value: string }> => {
  const disabled = disabledEvents || [];
  return events.map((e) => ({
    key: e,
    value: e,
    text: mapEventToName[e],
    disabled: disabled.includes(e),
  }));
};

const EventSelector: React.FC<{
  value: ActionEvent,
  disabledEvents?: string[];
}> = props => {
  const Outer = styled.span`
  &&&,
  * {
    font-size: 30px;
  }
  `;
  const options = generateOptions(allEvents, props.disabledEvents);
  return (
    <Outer>
      When {" "}
      <Dropdown
        inline
        options={options}
        value={props.value}
      />
    </Outer>
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
  const { value, disabledEvents, ...rest } = props;
  // const [notifyValue, setValue] = React.useState({});
  return (
    <Container>
      <EventSelector value={ value.name } disabledEvents={ disabledEvents } />
      <Item.Group divided>
        { value.actions.map( a => (
          <ActionInput key={`${value.name}--${a.name}`} value={a} />
        )) }
        {/* <NotifyInput value={notifyValue} onChange={setValue} /> */}
      </Item.Group>
      <pre>{JSON.stringify(value)}</pre>
    </Container>
  );
};
