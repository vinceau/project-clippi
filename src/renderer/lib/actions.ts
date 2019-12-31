import { ActionTypeGenerator, EventManager } from "@vinceau/event-actions";
import { createTwitchClip } from "common/twitch";
// import { notifyTwitchClip } from "./twitch";
import { store, dispatcher } from "../store";
import { notify } from "./utils";
import { sp } from "./sounds";

export enum Action {
    CREATE_TWITCH_CLIP = "twitch-clip",
    PLAY_SOUND = "play-sound",
    NOTIFY = "notify",
}

export interface ActionNotifyParams {
    title: string;
    body: string;
}

const ActionNotify: ActionTypeGenerator = (params: ActionNotifyParams) => {
    return async (): Promise<any> => {
        notify(params.title, params.body);
    };
};

export interface ActionPlaySoundParams {
    sound: string;
}

const ActionPlaySound: ActionTypeGenerator = (params: ActionPlaySoundParams) => {
    return async (): Promise<any> => {
        await sp.playSound(params.sound);
    };
};

export interface CreateTwitchClipParams {
    delay?: boolean;
    // notify?: boolean;
}

const ActionCreateTwitchClip: ActionTypeGenerator = (params: CreateTwitchClipParams) => {
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
            notify("Failed to create Twitch clip", "Are you sure you are live?");
            return;
        }
        // const clipID = "CoweringFineStapleRedCoat";
        // if (params.notify) {
        //     notifyTwitchClip(clipID);
        // }
    };
};

export const eventActionManager = new EventManager();

eventActionManager.registerAction(Action.CREATE_TWITCH_CLIP, ActionCreateTwitchClip);
eventActionManager.registerAction(Action.PLAY_SOUND, ActionPlaySound);
eventActionManager.registerAction(Action.NOTIFY, ActionNotify);

eventActionManager.setEventActions("on-twitch-clip", [
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
]);
/*
eventActionManager.registerEvent("on-twitch-clip", {
    name: Action.CREATE_TWITCH_CLIP,
    args: {
        delay: false,
    },
});
*/