import * as React from "react";

import { ActionTypeGenerator } from "@vinceau/event-actions";
import { produce } from "immer";
import { Checkbox, Icon } from "semantic-ui-react";

import { InlineDropdown, SimpleInput } from "@/components/Misc/InlineInputs";
import { notify as sendNotification } from "@/lib/utils";
import { createTwitchClip } from "common/twitch";
import { dispatcher, store } from "../store";
import { ActionComponent } from "./types";

interface ActionCreateTwitchClipParams {
    delay?: boolean;
    notify?: boolean;
    channel?: string;
}

const defaultParams = (): ActionCreateTwitchClipParams => {
    const user = store.getState().tempContainer.twitchUser;
    const channel = user ? user.name : "";
    return {
        delay: false,
        notify: true,
        channel,
    };
};

const actionCreateClip: ActionTypeGenerator = (params: ActionCreateTwitchClipParams) => {
    return async (): Promise<string | null> => {
        const token = store.getState().twitch.authToken;
        try {
            const clipID = await createTwitchClip(token, params.delay, params.channel);
            // Get timestamp in seconds
            const timestamp = (new Date()).getTime() / 1000;
            dispatcher.twitch.addTwitchClip({
                clipID,
                timestamp,
            });
            if (params.notify) {
                sendNotification(`Clipped ${clipID}`, "Twitch clip created");
            }
            return clipID;
        } catch (err) {
            console.error(err);
            sendNotification(`Failed to clip. ${params.channel ? "Is " + params.channel : "Are you"} live?`);
            return null;
        }
    };
};

const ActionIcon = () => {
    return (
        <Icon name="twitch" size="large" />
    );
};

const TwitchClipInput = (props: any) => {
    const { value, onChange } = props;
    const onDelayChange = (delay?: boolean) => {
        const newValue = produce(value, (draft: ActionCreateTwitchClipParams) => {
            draft.delay = delay;
        });
        onChange(newValue);
    };
    const toggleDelay = () => onDelayChange(!value.delay);
    const onNotifyChange = (notify?: boolean) => {
        const newValue = produce(value, (draft: ActionCreateTwitchClipParams) => {
            draft.notify = notify;
        });
        onChange(newValue);
    };
    const toggleNotify = () => onNotifyChange(!value.notify);

    return (
        <div>
            <div>
                Clip <SimpleInput value={"something"} />'s channel
            </div>
            <div style={{ marginBottom: "10px" }}>
                <Checkbox
                    label="Delay before clipping"
                    onChange={toggleDelay}
                    checked={value.delay}
                />
            </div>
            <div>
                <Checkbox
                    label="Notify after clipping"
                    onChange={toggleNotify}
                    checked={value.notify}
                />
            </div>
        </div>
    );
};

export const ActionTwitchClip: ActionComponent = {
    label: "create a Twitch clip",
    action: actionCreateClip,
    Icon: ActionIcon,
    Component: TwitchClipInput,
    defaultParams,
};
