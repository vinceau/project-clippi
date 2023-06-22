import type { Action as ActionDefinition, EventActions } from "@/lib/event_actions";
import { EventManager } from "@/lib/event_actions";

import { ActionChangeScene } from "./ActionChangeScene";
import { ActionNotify } from "./ActionNotify";
import { ActionPlaySound } from "./ActionPlaySound";
import { ActionRunShellCommand } from "./ActionRunShellCommand";
import { ActionSaveReplayBuffer } from "./ActionSaveReplayBuffer";
import { ActionToggleRecording } from "./ActionToggleRecording";
import { ActionToggleSource } from "./ActionToggleSource";
import { ActionTwitchClip } from "./ActionTwitchClip";
import { ActionWriteFile } from "./ActionWriteFile";
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
  RUN_SHELL_COMMAND = "run-shell-command",
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
  [Action.RUN_SHELL_COMMAND]: ActionRunShellCommand,
};

for (const [key, value] of Object.entries(actionComponents)) {
  eventActionManager.registerAction(key, value.action);
}
