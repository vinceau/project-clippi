import fs from "fs-extra";

import { produce } from "immer";
import { createTransform } from "redux-persist";
import { FileSystemState } from "./models/filesystem";
import { TwitchState } from "./models/twitch";
import { SlippiState } from "./models/slippi";
import { mapConfigurationToFilterSettings, mapFilterSettingsToConfiguration } from "@/lib/profile";
import { defaultComboFilterSettings } from "@vinceau/slp-realtime";

export const transformer = createTransform(
    state => state,
    (state, key) => produce(state, draft => {
        switch (key) {
            case "slippi":
                // Repopulate combo profiles with default values
                const { comboProfiles } = (draft as SlippiState);
                for (const [key, value] of Object.entries(comboProfiles)) {
                    // Get the current stored profiles
                    const converted = mapConfigurationToFilterSettings(JSON.parse(value));
                    // Join it with the default settings
                    const newConverted = Object.assign({}, defaultComboFilterSettings, converted);
                    (draft as SlippiState).comboProfiles[key] = JSON.stringify(mapFilterSettingsToConfiguration(newConverted))
                }
                break;
            case "twitch":
                // Rehydrate the Date object for timestamps
                const clips = (draft as TwitchState).clips;
                (draft as TwitchState).clips = {};
                Object.entries(clips).forEach(([name, value]) => {
                    // We used to store dates as a number in seconds so handle that case
                    // but now we just store the ISO timestamp string
                    const timestamp = new Date(typeof value.timestamp === "number" ? value.timestamp * 1000 : value.timestamp);
                    (draft as TwitchState).clips[name] = {
                        ...value,
                        timestamp,
                    };
                });
                break;
            case "filesystem":
                const soundFiles = (draft as FileSystemState).soundFiles;
                (draft as FileSystemState).soundFiles = {};
                Object.entries(soundFiles).forEach(([name, value]) => {
                    if (fs.existsSync(value)) {
                        (draft as FileSystemState).soundFiles[name] = value;
                    }
                });
                break;
        }
    }),
);
