import * as React from "react";

import { Action } from "@/lib/actions";
import { ActionEvent } from "@/lib/realtime";
import { Action as ActionDefinition } from "@vinceau/event-actions";
import { EventActions, AddEventDropdown } from "./EventActions";
import { produce } from "immer";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch, iRootState } from "@/store";

export interface EventActionConfig {
    event: ActionEvent;
    actions: ActionDefinition[];
}

const demoData: EventActionConfig[] = [
    {
        event: ActionEvent.COMBO_OCCURRED,
        actions: [
            {
                name: Action.NOTIFY,
                args: {
                    title: "wow",
                    body: "so amaze",
                },
            },
        ],
    },
    {
        event: ActionEvent.TEST_EVENT,
        actions: [
            {
                name: Action.PLAY_SOUND,
                args: {
                    sound: "test.mp3",
                },
            },
            {
                name: Action.NOTIFY,
                args: {
                    title: "hello world",
                    body: "happy new year",
                },
            },
        ],
    }
];

export const Automator: React.FC = () => {
    const val = useSelector((state: iRootState) => state.slippi.events);
    const dispatch = useDispatch<Dispatch>();
    const disabledEvents = val.map(e => e.event);
    const addEvent = (event: ActionEvent) => {
        dispatch.slippi.addNewEventAction(event);
    }
    return (
        <div>
            { val.map((e, i) => {
                const onChange = (newVal: EventActionConfig) => {
                    dispatch.slippi.updateActionEvent({
                        index: i,
                        event: newVal,
                    });
                };
                const onRemove = () => {
                    dispatch.slippi.removeActionEvent(i);
                };
                return (
                    <EventActions
                        key={e.event}
                        disabledOptions={disabledEvents}
                        value={e}
                        onChange={onChange}
                        onRemove={onRemove}
                    />
                );
            })
            }
            <AddEventDropdown onChange={addEvent} disabledOptions={disabledEvents} />
        </div>
    );
};
