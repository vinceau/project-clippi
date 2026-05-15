import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/ui/Button/Button";

import { Labelled } from "@/components/Labelled";
import { streamManager } from "@/lib/realtime";
import type { Dispatch, iRootState } from "@/store";
import type { NamedEventConfig } from "@/store/models/automator";

import { Pencil, Play, Plus, Power, PowerOff, Trash } from "lucide-react";
import { AutomatorPlaceholder } from "./AutomatorPlaceholder";
import { EventActionLists } from "./EventActionLists";
import { EventModal } from "./EventModal";

import styles from "./Automator.module.css";

export function Automator() {
  const [opened, setOpened] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<number>(0);
  const [edit, setEdit] = React.useState<NamedEventConfig | null>(null);
  const events = useSelector((state: iRootState) => state.automator.events);
  const actions = useSelector((state: iRootState) => state.automator.actions);
  const dispatch = useDispatch<Dispatch>();
  const invalidSelection = selected >= events.length || selected < 0;
  const isDisabled = !invalidSelection && events[selected] && events[selected].disabled;
  const disableEditButtons = invalidSelection || events.length === 0;
  const selectedActions = events[selected] ? actions[events[selected].id] || [] : [];
  const disabledTestButton = selectedActions.length === 0;
  const deleteEvent = () => {
    console.log(`deleting event with id: ${selected}/${events.length}`);
    if (invalidSelection) {
      return;
    }

    dispatch.automator.removeEvent(selected);
    if (selected > 0 && selected === events.length - 1) {
      setSelected(selected - 1);
    }
  };
  const toggleEvent = () => {
    const event = events[selected];
    dispatch.automator.updateEvent({ index: selected, event: { ...event, disabled: !event.disabled } });
  };
  const addEvent = (event: NamedEventConfig) => {
    if (event.id) {
      dispatch.automator.updateEvent({ index: selected, event });
    } else {
      const randomCode = Math.random().toString(36).slice(2);
      dispatch.automator.addEvent({
        ...event,
        id: randomCode,
      });
      setSelected(events.length);
    }
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
    <div className={styles.outer}>
      <EventModal onSubmit={addEvent} opened={opened} onClose={reset} edit={edit} />
      <div className={styles.headerBar}>
<div className={styles.buttonGroup}>
        <Button onClick={() => setOpened(true)}>
          <Plus /> Add event
        </Button>
        <Button onClick={deleteEvent} disabled={disableEditButtons}>
          <Trash /> Delete event
        </Button>
</div>
        {!disableEditButtons && (
          <div className={styles.buttonGroup}>
            <Labelled title="Test run event">
              <Button disabled={disabledTestButton} onClick={testRunEvent}>
                <Play />
              </Button>
            </Labelled>
            <Labelled title="Edit event">
              <Button onClick={editEvent}>
                <Pencil />
              </Button>
            </Labelled>
            <Labelled title={isDisabled ? "Enable event" : "Disable event"}>
              <Button onClick={toggleEvent}>{isDisabled ? <Power /> : <PowerOff />}</Button>
            </Labelled>
          </div>
        )}
      </div>
      <div className={styles.mainContent}>
        {events.length === 0 ? (
          <AutomatorPlaceholder />
        ) : (
          <EventActionLists selected={selected} onSelect={setSelected} />
        )}
      </div>
    </div>
  );
}
