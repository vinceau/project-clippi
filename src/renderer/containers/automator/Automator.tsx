/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";

import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon } from "semantic-ui-react";
import { EventModal } from "./EventModal";
import { NamedEventConfig } from "@/store/models/automator";
import { EventActionLists } from "./EventActionLists";
import { Labelled } from "@/components/Labelled";
import { streamManager } from "@/lib/realtime";
import { AutomatorPlaceholder } from "./AutomatorPlaceholder";

export const Automator: React.FC = () => {
  const [opened, setOpened] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<number>(0);
  const [edit, setEdit] = React.useState<NamedEventConfig | null>(null);
  const events = useSelector((state: iRootState) => state.automator.events);
  const dispatch = useDispatch<Dispatch>();
  const invalidSelection = selected >= events.length || selected < 0;
  const disableEditButtons = invalidSelection || events.length === 0;
  const deleteEvent = () => {
    console.log(`deleting event with id: ${selected}/${events.length}`);
    // Perform some basic validation of the current selected value
    if (invalidSelection) {
      return;
    }

    dispatch.automator.removeEvent(selected);
    // Select the previous value if we deleted the last element
    if (selected === events.length - 1) {
      setSelected(selected - 1);
    }
  };
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
  const testRunEvent = () => {
    if (!invalidSelection) {
      const eventId = events[selected].id;
      streamManager.testRunEvent(eventId);
    }
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
        padding-top: 2rem;
      `}
    >
      <EventModal onSubmit={addEvent} opened={opened} onClose={reset} edit={edit} />
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <div>
          <Button onClick={() => setOpened(true)}>
            <Icon name="plus" /> Add event
          </Button>
          <Button onClick={deleteEvent} disabled={disableEditButtons}>
            <Icon name="trash" /> Delete event
          </Button>
        </div>
        {!disableEditButtons && (
          <div>
            <Labelled title="Edit event">
              <Button onClick={editEvent} icon="pencil" />
            </Labelled>
            <Labelled title="Test run event">
              <Button onClick={testRunEvent} icon="play" />
            </Labelled>
          </div>
        )}
      </div>
      <div
        css={css`
          display: flex;
          flex: 1;
          margin-top: 1rem;
        `}
      >
        {events.length === 0 ? (
          <AutomatorPlaceholder />
        ) : (
          <EventActionLists selected={selected} onSelect={setSelected} />
        )}
      </div>
    </div>
  );
};
