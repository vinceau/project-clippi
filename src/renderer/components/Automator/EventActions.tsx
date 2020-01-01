import * as React from "react";

import styled from "styled-components";

import { Container, Item, Dropdown } from 'semantic-ui-react'
import { NotifyInput } from "./ActionInputs";
import { ActionEvent } from "@/lib/realtime";

const mapEventToName: { [eventName: string]: string } = {
  [ActionEvent.GAME_START]: "a new game starts",
  [ActionEvent.GAME_END]: "the game ends",
  [ActionEvent.PLAYER_DIED]: "someone dies",
  [ActionEvent.PLAYER_SPAWN]: "someone spawns",
  [ActionEvent.COMBO_OCCURRED]: "a combo occurs",
};

const generateOptions = (events: string[]): Array<{ key: string; text: string; value: string }> => {
  return events.map((e) => ({
    key: e,
    value: e,
    text: mapEventToName[e],
  }));
};

const EventSelector: React.FC<{
  events: string[];
  disabled?: string[];
}> = props => {
  const Outer = styled.span`
  &&&,
  * {
    font-size: 30px;
  }
  `;
  const options = generateOptions(props.events);
  return (
    <Outer>
      When {" "}
      <Dropdown
        inline
        options={options}
        defaultValue={options[0].value}
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
  const [value, setValue] = React.useState({});
  const events = [
    ActionEvent.GAME_START,
    ActionEvent.GAME_END,
    ActionEvent.PLAYER_DIED,
    ActionEvent.PLAYER_SPAWN,
    ActionEvent.COMBO_OCCURRED,
  ];
  return (
    <Container>
      <EventSelector events={events} />
      <Item.Group divided>
        <NotifyInput value={value} onChange={setValue} />
      </Item.Group>
      <pre>{JSON.stringify(value)}</pre>
    </Container>
  );
};
