/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";

import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon } from "semantic-ui-react";
import { EventModal } from "./EventModal";
import { NamedEventConfig } from "@/store/models/automator";
import { EventActionLists } from "./EventActionLists";

export const Automator: React.FC = () => {
  const [opened, setOpened] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<number>(0);
  const [edit, setEdit] = React.useState<NamedEventConfig | null>(null);
  const events = useSelector((state: iRootState) => state.automator.events);
  const dispatch = useDispatch<Dispatch>();
  const addEvent = (event: NamedEventConfig) => {
    if (event.id) {
      // This was an edit
      dispatch.automator.updateEvent({ index: selected, event });
    } else {
      // This was a new event
      const randomCode = Math.random().toString(36).slice(2);
      dispatch.automator.addEvent({
        ...event,
        id: randomCode,
      });
      // Select our recently created event
      setSelected(events.length);
    }
    // Reset the form for next time
    reset();
  };
  const editEvent = () => {
    setEdit(events[selected]);
    setOpened(true);
  };
  const reset = () => {
    console.log("resetting form");
    setOpened(false);
    setEdit(null);
  };
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        flex: 1;
      `}
    >
      <EventModal onSubmit={addEvent} opened={opened} onClose={reset} edit={edit} />
      <div>
        <Button onClick={() => setOpened(true)}>
          <Icon name="plus" /> Add event
        </Button>
        <Button onClick={editEvent}>
          <Icon name="pencil" /> Edit event
        </Button>
        <Button>
          <Icon name="trash" /> Delete event
        </Button>
      </div>
      <div
        css={css`
          display: flex;
          flex: 1;
          margin-top: 1rem;
        `}
      >
        <EventActionLists selected={selected} onSelect={setSelected} />
      </div>
    </div>
  );
};
