import { EventActionConfig } from "@/components/Automator/Automator";
import { ActionTypeGenerator, EventManager } from "@vinceau/event-actions";
import { createTwitchClip } from "common/twitch";
import { dispatcher, store } from "../store";
import { sp } from "./sounds";
import { notify } from "./utils";

export enum Action {
    CREATE_TWITCH_CLIP = "twitch-clip",
    PLAY_SOUND = "play-sound",
    NOTIFY = "notify",
}

export interface ActionPlaySoundParams {
    sound: string;
}

const ActionPlaySound: ActionTypeGenerator = (params: ActionPlaySoundParams) => {
    return async (): Promise<any> => {
        await sp.playSound(params.sound);
    };
};

export interface ActionCreateTwitchClipParams {
    delay?: boolean;
    // notify?: boolean;
}

const ActionCreateTwitchClip: ActionTypeGenerator = (params: ActionCreateTwitchClipParams) => {
    return async (): Promise<any> => {
        const token = store.getState().twitch.authToken;
        console.log(`params:`);
        console.log(params);
        console.log(`creating clip with token: ${token}`);
        try {
            const clipID = await createTwitchClip(token, params.delay);
            // Get timestamp in seconds
            const timestamp = (new Date()).getTime() / 1000;
            dispatcher.twitch.addTwitchClip({
                clipID,
                timestamp,
            });
            return clipID;
        } catch (err) {
            console.error(err);
            notify("Failed to create Twitch clip. Are you sure you are live?");
            return;
        }
    };
};

export const eventActionManager = new EventManager();

export const updateEventActionManager = (actions: EventActionConfig[]) => {
    const mapping: any = {};
    for (const a of actions)  {
        mapping[a.event] = a.actions;
    }
    eventActionManager.eventActions = mapping;
};

eventActionManager.registerAction(Action.CREATE_TWITCH_CLIP, ActionCreateTwitchClip);
eventActionManager.registerAction(Action.PLAY_SOUND, ActionPlaySound);
