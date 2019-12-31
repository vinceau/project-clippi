import * as React from "react";

import styled from "styled-components";

import { Container, Item, Dropdown } from 'semantic-ui-react'
import { NotifyInput } from "./ActionInputs";
import { ActionEvent } from "@/lib/realtime";

/*
export enum ActionEvent {
  GAME_START = "game-start",
  GAME_END = "game-end",
  PLAYER_SPAWN = "player-spawn",
  PLAYER_DIED = "player-died",
  COMBO_OCCURRED = "combo-occurred",
}
*/
const friendOptions = [
  {
    key: ActionEvent.GAME_START,
    text: "a new game starts",
    value: ActionEvent.GAME_START,
  },
  {
    key: ActionEvent.GAME_END,
    text: "the game ends",
    value: ActionEvent.GAME_END,
  },
  {
    key: ActionEvent.PLAYER_DIED,
    text: "someone dies",
    value: ActionEvent.PLAYER_DIED,
  },
  {
    key: ActionEvent.PLAYER_SPAWN,
    text: "someone spawns",
    value: ActionEvent.PLAYER_SPAWN,
  },
  {
    key: ActionEvent.COMBO_OCCURRED,
    text: "a combo occurs",
    value: ActionEvent.COMBO_OCCURRED,
  },
];

export const EventActions = () => {
  const [value, setValue] = React.useState({});
  const EventSelector = styled.span`
  &&&,
  * {
    font-size: 30px;
  }
  `;
  return (
    <Container>
      <EventSelector>
        When {" "}
        <Dropdown
          inline
          options={friendOptions}
          defaultValue={friendOptions[0].value}
        />
      </EventSelector>
<Item.Group divided>
      <NotifyInput value={value} onChange={setValue} />
</Item.Group>
      <pre>{JSON.stringify(value)}</pre>
    </Container>
  );
};
