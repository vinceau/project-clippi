import { ActionTypeGenerator, EventManager } from "@vinceau/event-actions";
import { createTwitchClip } from "common/twitch";
// import { notifyTwitchClip } from "./twitch";
import { store, dispatcher } from "../store";
import { notify } from "./utils";

export interface CreateTwitchClipParams {
    delay?: boolean;
    // notify?: boolean;
}

const ActionCreateTwitchClip: ActionTypeGenerator = (params: CreateTwitchClipParams) => {
    return async (...args: any[]): Promise<any> => {
        const token = store.getState().twitch.authToken;
        console.log(`params:`);
        console.log(params);
        console.log(`creating clip with token: ${token}`);
        try {
            const clipID = await createTwitchClip(token, params.delay);
            dispatcher.twitch.addTwitchClip({
                clipID,
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

eventActionManager.registerAction("twitch-clip", ActionCreateTwitchClip);
eventActionManager.registerEvent("on-twitch-clip", {
    name: "twitch-clip",
    args: {
        delay: false,
    },
});
