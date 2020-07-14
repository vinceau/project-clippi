import { init, RematchRootState } from "@rematch/core";
import createRematchPersist, { getPersistor } from "@rematch/persist";

import * as models from "./models";

import { updateEventActionManager } from "@/containers/actions";
import { dolphinRecorder } from "@/lib/dolphin";
import { obsConnection } from "@/lib/obs";
import { mapConfigurationToFilterSettings } from "@/lib/profile";
// import { comboFilter } from "@/lib/realtime";
import { soundPlayer } from "@/lib/sounds";
import { transformer } from "./transformer";
import { streamManager } from "@/lib/realtime";
import { InputEvent, EventConfig } from "@vinceau/slp-realtime";
import { mapInputEventConfig } from "@/lib/inputs";

const persistPlugin = createRematchPersist({
  version: 1,
  blacklist: ["tempContainer"],
  transforms: [transformer],
});

export const store = init({
  models,
  plugins: [persistPlugin],
});

export const dispatcher = store.dispatch;

export const persistor = getPersistor();
export type Store = typeof store;
export type Dispatch = typeof store.dispatch;
export type iRootState = RematchRootState<typeof models>;

export const Models = models;

const storeSync = () => {
  const state = store.getState();

  // Restore actions
  const actions = state.automator.actions;
  updateEventActionManager(actions);

  // Restore sound files
  const soundFiles = state.filesystem.soundFiles;
  soundPlayer.sounds = soundFiles;

  // Restore combo settings
  const eventConfigVars = {};
  Object.keys(state.slippi.comboProfiles).map((key) => {
    const slippiSettings = state.slippi.comboProfiles[key];
    const converted = mapConfigurationToFilterSettings(JSON.parse(slippiSettings));
    eventConfigVars[`$${key}`] = converted;
  });
  streamManager.updateEventConfig({
    variables: eventConfigVars,
    events: state.automator.events.map(
      (event): EventConfig => {
        const { type, filter } = event;
        switch (type) {
          case InputEvent.BUTTON_COMBO:
            const newButtonConfig = {
              ...event,
              filter: mapInputEventConfig(filter as any),
            };
            return newButtonConfig;
        }
        return event;
      }
    ),
  });
};

store.subscribe(() => {
  storeSync();
});

obsConnection.connectionStatus$.subscribe((status) => {
  dispatcher.tempContainer.setOBSConnectionStatus(status);
});
obsConnection.recordingStatus$.subscribe((status) => {
  dispatcher.tempContainer.setOBSRecordingStatus(status);
});
obsConnection.scenes$.subscribe((scenes) => {
  dispatcher.tempContainer.setOBSScenes(scenes);
});
dolphinRecorder.currentBasename$.subscribe((name) => {
  dispatcher.tempContainer.setDolphinPlaybackFile(name);
});
dolphinRecorder.dolphinRunning$.subscribe((isRunning) => {
  dispatcher.tempContainer.setDolphinRunning(isRunning);
});
