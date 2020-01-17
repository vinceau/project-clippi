import { Action as ActionDefinition, EventActions, EventManager } from "@vinceau/event-actions";

import { ActionEvent } from "@/lib/realtime";
import { ActionChangeScene } from "./ActionChangeScene";
import { ActionNotify } from "./ActionNotify";
import { ActionPlaySound } from "./ActionPlaySound";
import { ActionToggleSource } from "./ActionToggleSource";
import { ActionTwitchClip } from "./ActionTwitchClip";
import { ActionWriteFile } from "./ActionWriteFile";
import { ActionComponent } from "./types";

export enum Action {
    CREATE_TWITCH_CLIP = "twitch-clip",
    PLAY_SOUND = "play-sound",
    NOTIFY = "notify",
    CHANGE_SCENE = "change-scene",
    TOGGLE_SOURCE = "toggle-source",
    WRITE_FILE = "write-file",
}

export interface EventActionConfig {
    event: ActionEvent;
    actions: ActionDefinition[];
}

export const eventActionManager = new EventManager();

export const updateEventActionManager = (actions: EventActionConfig[]) => {
    const mapping: EventActions = {};
    for (const a of actions)  {
        mapping[a.event] = a.actions;
    }
    eventActionManager.eventActions = mapping;
};

export const actionComponents: { [name: string]: ActionComponent} = {
    [Action.CREATE_TWITCH_CLIP]: ActionTwitchClip,
    [Action.NOTIFY]: ActionNotify,
    [Action.PLAY_SOUND]: ActionPlaySound,
    [Action.CHANGE_SCENE]: ActionChangeScene,
    [Action.TOGGLE_SOURCE]: ActionToggleSource,
    [Action.WRITE_FILE]: ActionWriteFile,
};

for (const [key, value] of Object.entries(actionComponents)) {
    eventActionManager.registerAction(key, value.action);
}
