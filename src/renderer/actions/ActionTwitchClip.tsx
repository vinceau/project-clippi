import * as React from "react";

import { ActionTypeGenerator } from "@vinceau/event-actions";
import { produce } from "immer";
import { Checkbox, Icon } from "semantic-ui-react";

import { notify } from "@/lib/utils";
import { createTwitchClip } from "common/twitch";
import { dispatcher, store } from "../store";
import { ActionComponent } from "./types";

interface ActionCreateTwitchClipParams {
    delay?: boolean;
    // notify?: boolean;
}

const actionCreateClip: ActionTypeGenerator = (params: ActionCreateTwitchClipParams) => {
    return async (): Promise<string | null> => {
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
            return null;
        }
    };
};

const Snippet = () => {
    return <div>clip it</div>;
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
    const toggle = () => onDelayChange(!value.delay);

    return (
        <div>
            <Checkbox
                label="Delay before clipping"
                onChange={toggle}
                checked={value.delay}
            />
        </div>
    );
};

export const ActionTwitchClip: ActionComponent = {
    label: "create a Twitch clip",
    action: actionCreateClip,
    Snippet,
    Icon: ActionIcon,
    Component: TwitchClipInput,
};
