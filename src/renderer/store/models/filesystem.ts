import { createModel } from "@rematch/core";
import { remote } from "electron";
import produce from "immer";
import * as path from "path";

import { getDolphinPath } from "@/lib/dolphin";
import type { SoundMap } from "@/lib/sounds";
import { getFilePath } from "@/lib/utils";

const homeDirectory = remote.app.getPath("home");

export interface FileSystemState {
  filesPath: string;
  liveSlpFilesPath: string;
  combosFilePath: string;
  meleeIsoPath: string;
  dolphinPath: string;
  soundFiles: SoundMap;
  recordSeparateClips: boolean;
}

export const fileSystemInitialState: FileSystemState = {
  filesPath: homeDirectory,
  liveSlpFilesPath: "",
  combosFilePath: path.join(homeDirectory, "combos.json"),
  meleeIsoPath: "",
  dolphinPath: getDolphinPath(),
  soundFiles: {},
  recordSeparateClips: false,
};

export const filesystem = createModel({
  state: fileSystemInitialState,
  reducers: {
    setSound: (state: FileSystemState, payload: { name: string; filePath: string }): FileSystemState => {
      const newState = produce(state.soundFiles, (draft) => {
        draft[payload.name] = payload.filePath;
      });
      return produce(state, (draft) => {
        draft.soundFiles = newState;
      });
    },
    removeSound: (state: FileSystemState, payload: string): FileSystemState => {
      const newState = produce(state.soundFiles, (draft) => {
        delete draft[payload];
      });
      return produce(state, (draft) => {
        draft.soundFiles = newState;
      });
    },
    setLiveSlpFilesPath: (state: FileSystemState, payload: string): FileSystemState =>
      produce(state, (draft) => {
        draft.liveSlpFilesPath = payload;
      }),
    setFilesPath: (state: FileSystemState, payload: string): FileSystemState =>
      produce(state, (draft) => {
        draft.filesPath = payload;
      }),
    setCombosFilePath: (state: FileSystemState, payload: string): FileSystemState =>
      produce(state, (draft) => {
        draft.combosFilePath = payload;
      }),
    setRecordSeparateClips: (state: FileSystemState, payload: boolean): FileSystemState =>
      produce(state, (draft) => {
        draft.recordSeparateClips = payload;
      }),
    setMeleeIsoPath: (state: FileSystemState, payload: string): FileSystemState =>
      produce(state, (draft) => {
        draft.meleeIsoPath = payload;
      }),
    setDolphinPath: (state: FileSystemState, payload: string): FileSystemState =>
      produce(state, (draft) => {
        draft.dolphinPath = payload;
      }),
  },
  effects: (dispatch) => ({
    async addSound() {
      const p = await getFilePath(
        {
          filters: [{ name: "Audio files", extensions: ["flac", "mp3", "m4a", "webm", "wav", "aac", "ogg", "opus"] }],
        },
        false
      );
      if (p && p.length > 0) {
        const name = path.basename(p[0]);
        dispatch.filesystem.setSound({
          name,
          filePath: p[0],
        });
      }
    },
  }),
});
