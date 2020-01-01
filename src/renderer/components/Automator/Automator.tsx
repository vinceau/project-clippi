import * as React from "react";

import { EventActions } from "./EventActions";
import { Action as ActionDefinition } from "@vinceau/event-actions";
import { ActionEvent } from "@/lib/realtime";
import { Action } from "@/lib/actions";

interface EventActionConfig {
    name: ActionEvent;
    actions: ActionDefinition[];
}

const demoData: EventActionConfig[] = [
    {
        name: ActionEvent.TEST_EVENT,
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
    const disabledEvents = demoData.map(e => e.name);
    return (
        <div>
            { demoData.map(e => {
                return (
                    <EventActions key={e.name} disabledEvents={disabledEvents} value={e} />
                );
            })
            }
        </div>
    );
}