import { clsx } from "clsx";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { actionComponents } from "@/containers/actions";
import type { Action } from "@/lib/event_actions";
import { generateEventName } from "@/lib/events";
import type { Dispatch, iRootState } from "@/store";

import { ActionInput, AddActionInput } from "./ActionInputs";
import { EventItem } from "./EventItem";

import styles from "./EventActionLists.module.css";

export interface EventActionListsProps {
  selected: number;
  onSelect: (i: number) => void;
}

export function EventActionLists({ selected, onSelect }: EventActionListsProps) {
  const val = useSelector((state: iRootState) => state.automator.events);
  const actions = useSelector((state: iRootState) => state.automator.actions);
  const dispatch = useDispatch<Dispatch>();
  const selectedEvent = val[selected];
  const selectedEventName = selectedEvent.name ? selectedEvent.name : `${generateEventName(selectedEvent)}...`;
  const selectedActions = selectedEvent ? actions[selectedEvent.id] || [] : [];
  const disabledActions = selectedActions.map((a) => a.name);
  const onActionChange = (index: number, action: Action) => {
    const eventId = selectedEvent.id;
    dispatch.automator.updateActionEvent({ eventId, index, action });
  };
  const onActionRemove = (index: number) => {
    const eventId = selectedEvent.id;
    dispatch.automator.removeActionEvent({ eventId, index });
  };
  const onActionAdd = (name: string) => {
    const eventId = selectedEvent.id;
    const params = actionComponents[name].defaultParams;
    const action = {
      name,
      args: params ? params() : {},
    };
    dispatch.automator.addNewEventAction({ eventId, action });
  };
  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <div className={styles.header}>
          <h2>Events</h2>
        </div>
        <div className={styles.columnContent}>
          {val.map((e, i) => {
            return (
              <EventItem
                key={e.id}
                selected={selected === i}
                disabled={e.disabled}
                onClick={() => onSelect(i)}
                event={e}
              />
            );
          })}
        </div>
      </div>
      <div className={clsx(styles.column, styles.actionColumn)}>
        <div className={styles.header}>
          <h2>Actions</h2>
        </div>
        <div className={styles.columnContent}>
          <div className={styles.eventName}>{selectedEventName}</div>
          <div>
            {selectedActions.map((a, i) => {
              const onInnerActionChange = (newVal: Action) => {
                onActionChange(i, newVal);
              };
              const prefix = i === 0 ? "Then " : "And ";
              return (
                <ActionInput
                  key={`${selectedEvent.id}--${a.name}`}
                  selectPrefix={prefix}
                  value={a}
                  onChange={onInnerActionChange}
                  disabledActions={[]}
                  onRemove={() => onActionRemove(i)}
                />
              );
            })}
            <AddActionInput onChange={onActionAdd} disabledActions={disabledActions} />
          </div>
        </div>
      </div>
    </div>
  );
}
