import produce from "immer";

import { createModel } from "@rematch/core";

import { getLatestVersion, needsUpdate } from "@/lib/checkForUpdates";
import { notify } from "@/lib/utils";

export interface AppContainerState {
    latestVersion: string;
    nextUpdateCheckTime: string;  // ISO Date string
    needsUpdate: boolean;
    isDev: boolean;
}

const initialState: AppContainerState = {
    latestVersion: "0.0.0",
    nextUpdateCheckTime: new Date(0).toISOString(),  // 1st of Jan 1970
    needsUpdate: false,
    isDev: false,
};

export const appContainer = createModel({
    state: initialState,
    reducers: {
        setIsDev: (state: AppContainerState, payload: boolean): AppContainerState => {
            return produce(state, draft => {
                draft.isDev = payload;
            });
        },
        setNeedsUpdate: (state: AppContainerState, payload: boolean): AppContainerState => {
            return produce(state, draft => {
                draft.needsUpdate = payload;
            });
        },
        setNextUpdateCheckTime: (state: AppContainerState, payload: Date): AppContainerState => {
            return produce(state, draft => {
                draft.nextUpdateCheckTime = payload.toISOString();
            });
        },
        setLatestVersion: (state: AppContainerState, payload: string): AppContainerState => {
            return produce(state, draft => {
                draft.latestVersion = payload;
            });
        },
    },
    effects: dispatch => ({
        async checkForUpdates(_, rootState) {
            // If the last check was within the last day then return
            const nextUpdateAt = new Date(rootState.appContainer.nextUpdateCheckTime);
            if (nextUpdateAt > new Date()) {
                console.log(`Next update check: ${nextUpdateAt}`);
                return;
            }

            console.log("Checking for updates...");
            try {
                const lastKnownVersion = rootState.appContainer.latestVersion;
                const latest = await getLatestVersion("vinceau", "project-clippi");

                const newUpdateTime = new Date();
                newUpdateTime.setDate(newUpdateTime.getDate() + 1);
                console.log("Setting new update time to: " + newUpdateTime);
                dispatch.appContainer.setNextUpdateCheckTime(newUpdateTime);

                if (latest !== lastKnownVersion) {
                    console.log(`Setting latest version to: ${latest}`);
                    dispatch.appContainer.setLatestVersion(latest);

                    const shouldUpdate = needsUpdate(latest);
                    dispatch.appContainer.setNeedsUpdate(shouldUpdate);
                    if (shouldUpdate) {
                        notify("A new Project Clippi update is available!");
                    }
                }
            } catch (err) {
                console.error(err);
            }
        },
    }),
});
