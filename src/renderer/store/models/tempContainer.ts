import { createModel } from "@rematch/core";
import produce from "immer";

import { Scene } from "obs-websocket-js";

import { authenticateTwitch, signOutTwitch } from "../../lib/twitch";

import { OBSConnectionStatus, OBSRecordingStatus } from "@/lib/obs";
import { getFilePath, loadDolphinQueue } from "@/lib/utils";
import { ConnectionStatus, DolphinEntry, DolphinQueueFormat, DolphinQueueOptions } from "@vinceau/slp-realtime";
import { TwitchUser, UpdateStatus, VersionUpdatePayload } from "common/types";
import { shuffle } from "common/utils";

export interface TempContainerState {
  slippiConnectionType: "console" | "dolphin";
  slippiConnectionStatus: ConnectionStatus;
  obsConnectionStatus: OBSConnectionStatus;
  obsRecordingStatus: OBSRecordingStatus;
  obsScenes: Scene[];
  twitchUser: TwitchUser | null;
  twitchLoading: boolean;
  showSettings: boolean;
  currentSlpFolderStream: string;
  comboFinderPercent: number;
  comboFinderLog: string;
  comboFinderProcessing: boolean;
  latestPath: { [page: string]: string };
  dolphinQueue: DolphinEntry[];
  dolphinQueueOptions: DolphinQueueOptions;
  dolphinPlaybackFile: string;
  dolphinRunning: boolean;
  updateStatus: VersionUpdatePayload | null;
  updateAvailable: boolean;
}

const initialDolphinQueueOptions = {
  mode: "queue",
  replay: "",
  isRealTimeMode: false,
  outputOverlayFiles: true,
};

const initialState: TempContainerState = {
  slippiConnectionType: "console",
  slippiConnectionStatus: ConnectionStatus.DISCONNECTED,
  obsConnectionStatus: OBSConnectionStatus.DISCONNECTED,
  obsRecordingStatus: OBSRecordingStatus.RECORDING,
  obsScenes: [],
  twitchUser: null,
  twitchLoading: false,
  showSettings: false,
  currentSlpFolderStream: "",
  comboFinderPercent: 0,
  comboFinderLog: "",
  comboFinderProcessing: false,
  latestPath: {
    main: "/main/automator",
    settings: "/settings/combo-settings",
  },
  dolphinQueue: [],
  dolphinQueueOptions: Object.assign({}, initialDolphinQueueOptions),
  dolphinPlaybackFile: "",
  dolphinRunning: false,
  updateStatus: null,
  updateAvailable: false,
};

export const tempContainer = createModel({
  state: initialState,
  reducers: {
    setSlippiConnectionStatus: (state: TempContainerState, payload: ConnectionStatus): TempContainerState =>
      produce(state, (draft) => {
        draft.slippiConnectionStatus = payload;
      }),
    setSlippiConnectionType: (state: TempContainerState, payload: "console" | "dolphin"): TempContainerState =>
      produce(state, (draft) => {
        draft.slippiConnectionType = payload;
      }),
    setOBSConnectionStatus: (state: TempContainerState, payload: OBSConnectionStatus): TempContainerState =>
      produce(state, (draft) => {
        draft.obsConnectionStatus = payload;
      }),
    setOBSRecordingStatus: (state: TempContainerState, payload: OBSRecordingStatus): TempContainerState =>
      produce(state, (draft) => {
        draft.obsRecordingStatus = payload;
      }),
    setOBSScenes: (state: TempContainerState, payload: Scene[]): TempContainerState =>
      produce(state, (draft) => {
        draft.obsScenes = payload;
      }),
    setTwitchUser: (state: TempContainerState, payload: TwitchUser): TempContainerState =>
      produce(state, (draft) => {
        draft.twitchUser = payload;
      }),
    setTwitchLoading: (state: TempContainerState, payload: boolean): TempContainerState =>
      produce(state, (draft) => {
        draft.twitchLoading = payload;
      }),
    toggleSettings: (state: TempContainerState): TempContainerState =>
      produce(state, (draft) => {
        draft.showSettings = !state.showSettings;
      }),
    setPercent: (state: TempContainerState, payload: number): TempContainerState =>
      produce(state, (draft) => {
        // Make sure the payload is between 0 and 100
        const percent = payload < 0 ? 0 : payload > 100 ? 100 : payload;
        draft.comboFinderPercent = percent;
      }),
    setLatestPath: (state: TempContainerState, payload: { page: string; pathname: string }): TempContainerState => {
      const newState = produce(state.latestPath, (draft) => {
        draft[payload.page] = payload.pathname;
      });
      return produce(state, (draft) => {
        draft.latestPath = newState;
      });
    },
    setComboLog: (state: TempContainerState, payload: string): TempContainerState =>
      produce(state, (draft) => {
        draft.comboFinderLog = payload;
      }),
    setComboFinderProcessing: (state: TempContainerState, payload: boolean): TempContainerState =>
      produce(state, (draft) => {
        draft.comboFinderProcessing = payload;
      }),
    setSlpFolderStream: (state: TempContainerState, payload: string): TempContainerState =>
      produce(state, (draft) => {
        draft.currentSlpFolderStream = payload;
      }),
    clearSlpFolderStream: (state: TempContainerState): TempContainerState =>
      produce(state, (draft) => {
        draft.currentSlpFolderStream = "";
      }),
    setDolphinQueue: (state: TempContainerState, payload: DolphinEntry[]): TempContainerState =>
      produce(state, (draft) => {
        draft.dolphinQueue = payload;
      }),
    shuffleDolphinQueue: (state: TempContainerState): TempContainerState =>
      produce(state, (draft) => {
        draft.dolphinQueue = shuffle(draft.dolphinQueue);
      }),
    removeDolphinQueueEntry: (state: TempContainerState, payload: number): TempContainerState => {
      const index = payload;
      const numItems = state.dolphinQueue.length;
      // The number is invalid
      if (index >= numItems || index < 0) {
        return state;
      }
      return produce(state, (draft) => {
        draft.dolphinQueue.splice(index, 1);
      });
    },
    moveDolphinQueueEntry: (
      state: TempContainerState,
      payload: { startIndex: number; endIndex: number }
    ): TempContainerState => {
      const { startIndex, endIndex } = payload;
      return produce(state, (draft) => {
        draft.dolphinQueue.splice(endIndex, 0, draft.dolphinQueue.splice(startIndex, 1)[0]);
      });
    },
    appendDolphinQueue: (state: TempContainerState, payload: DolphinEntry[]): TempContainerState => {
      // Disallow duplicate paths
      const existingPaths = state.dolphinQueue.map((f) => f.path);
      const newFiles = payload.filter((f) => !existingPaths.includes(f.path));
      return produce(state, (draft) => {
        draft.dolphinQueue = [...state.dolphinQueue, ...newFiles];
      });
    },
    setDolphinQueueOptions: (state: TempContainerState, payload: Partial<DolphinQueueOptions>): TempContainerState => {
      const newState = produce(state.dolphinQueueOptions, (draft) => {
        const merged = Object.assign({}, draft, payload);
        draft = merged;
      });
      return produce(state, (draft) => {
        draft.dolphinQueueOptions = newState;
      });
    },
    setDolphinQueueFromJson: (state: TempContainerState, payload: DolphinQueueFormat): TempContainerState => {
      const { queue, ...rest } = payload;
      return produce(state, (draft) => {
        draft.dolphinQueueOptions = Object.assign({}, state.dolphinQueueOptions, rest);
        draft.dolphinQueue = queue || [];
      });
    },
    resetDolphinQueue: (state: TempContainerState): TempContainerState =>
      produce(state, (draft) => {
        draft.dolphinQueueOptions = Object.assign({}, initialDolphinQueueOptions);
        draft.dolphinQueue = [];
      }),
    setDolphinPlaybackFile: (state: TempContainerState, payload: string): TempContainerState =>
      produce(state, (draft) => {
        draft.dolphinPlaybackFile = payload;
      }),
    setDolphinRunning: (state: TempContainerState, payload: boolean): TempContainerState =>
      produce(state, (draft) => {
        draft.dolphinRunning = payload;
      }),
    setUpdateStatus: (state: TempContainerState, payload: VersionUpdatePayload | null): TempContainerState =>
      produce(state, (draft) => {
        draft.updateStatus = payload;
        draft.updateAvailable =
          payload !== null &&
          (payload.status === UpdateStatus.UPDATE_AVAILABLE || payload.status === UpdateStatus.DOWNLOAD_COMPLETE);
      }),
  },
  effects: (dispatch) => ({
    async loadDolphinQueue() {
      const dolphinQueue = await loadDolphinQueue();
      if (!dolphinQueue) {
        console.error("Couldn't load dolphin queue");
        return;
      }
      dispatch.tempContainer.setDolphinQueueFromJson(dolphinQueue);
    },
    async addFileToDolphinQueue() {
      const p = await getFilePath(
        {
          filters: [{ name: "SLP files", extensions: ["slp"] }],
          properties: ["openFile", "multiSelections"],
        },
        false
      );
      if (p && p.length > 0) {
        dispatch.tempContainer.appendDolphinQueue(
          p.map((filepath) => ({
            path: filepath,
          }))
        );
      }
    },
    async authenticateTwitch() {
      dispatch.tempContainer.setTwitchLoading(true);
      const scopes = ["user_read", "clips:edit", "chat:read", "chat:edit"];
      console.log(`Authenticating with Twitch using the scopes: ${scopes}`);
      const user = await authenticateTwitch(scopes);
      console.log("Got the following user object back from Twitch:");
      console.log(user);
      dispatch.tempContainer.setTwitchUser(user);
      dispatch.tempContainer.setTwitchLoading(false);
    },
    async logOutTwitch() {
      await signOutTwitch();
      dispatch.tempContainer.setTwitchUser(null);
    },
  }),
});
