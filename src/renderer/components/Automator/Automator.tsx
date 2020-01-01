import * as React from "react";

import { Action } from "@/lib/actions";
import { ActionEvent } from "@/lib/realtime";
import { Action as ActionDefinition } from "@vinceau/event-actions";
import { EventActions } from "./EventActions";
import { produce } from "immer";

interface EventActionConfig {
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
    const [val, setVal] = React.useState<EventActionConfig[]>(demoData);
    const disabledEvents = val.map(e => e.event);
    return (
        <div>
            { val.map((e, i) => {
                const onChange = (newVal: EventActionConfig) => {
                    const nextVal = produce(val, draft => {
                        draft[i] = newVal;
                    });
                    setVal(nextVal);
                };
                const onRemove = () => {
                    const nextVal = produce(val, draft => {
                        draft.splice(i, 1);
                    });
                    setVal(nextVal);
                };
                return (
                    <EventActions
                        key={e.event}
                        disabledEvents={disabledEvents}
                        value={e}
                        onChange={onChange}
                        onRemove={onRemove}
                    />
                );
            })
            }
        </div>
    );
};
