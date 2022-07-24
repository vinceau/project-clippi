import type { Action as ActionDefinition, EventActions } from "@vinceau/event-actions";
import { EventManager } from "@vinceau/event-actions";

import { ActionChangeScene } from "./ActionChangeScene";
import { ActionNotify } from "./ActionNotify";
import { ActionPlaySound } from "./ActionPlaySound";
import { ActionSaveReplayBuffer } from "./ActionSaveReplayBuffer";
import { ActionToggleRecording } from "./ActionToggleRecording";
import { ActionToggleSource } from "./ActionToggleSource";
import { ActionTwitchClip } from "./ActionTwitchClip";
import { ActionWriteFile } from "./ActionWriteFile";
import { ActionExecuteScript } from "./ActionExecuteScript";
import type { ActionComponent } from "./types";

export enum Action {
  CREATE_TWITCH_CLIP = "twitch-clip",
  PLAY_SOUND = "play-sound",
  NOTIFY = "notify",
  CHANGE_SCENE = "change-scene",
  TOGGLE_SOURCE = "toggle-source",
  WRITE_FILE = "write-file",
  SAVE_REPLAY_BUFFER = "save-replay-buffer",
  TOGGLE_RECORDING = "toggle-recording",
  EXECUTE_SCRIPT = "execute-script",
}

export interface EventActionConfig {
  event: string;
  actions: ActionDefinition[];
}

export const eventActionManager = new EventManager();

export const updateEventActionManager = (mapping: EventActions): void => {
  // const mapping: EventActions = {};
  // for (const a of actions) {
  //   mapping[a.event] = a.actions;
  // }
  eventActionManager.eventActions = mapping;
};

export const actionComponents: { [name: string]: ActionComponent } = {
  [Action.CREATE_TWITCH_CLIP]: ActionTwitchClip,
  [Action.NOTIFY]: ActionNotify,
  [Action.PLAY_SOUND]: ActionPlaySound,
  [Action.WRITE_FILE]: ActionWriteFile,
  [Action.CHANGE_SCENE]: ActionChangeScene,
  [Action.TOGGLE_SOURCE]: ActionToggleSource,
  [Action.SAVE_REPLAY_BUFFER]: ActionSaveReplayBuffer,
  [Action.TOGGLE_RECORDING]: ActionToggleRecording,
  [Action.EXECUTE_SCRIPT]: ActionExecuteScript,
};

for (const [key, value] of Object.entries(actionComponents)) {
  eventActionManager.registerAction(key, value.action);
}
