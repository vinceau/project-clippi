import * as React from "react";

import { ActionTypeGenerator } from "@vinceau/event-actions";
import { produce } from "immer";
import { Icon } from "semantic-ui-react";

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
    const [channel, setChannel] = React.useState<string>(value.channel || "");
    const onDelayChange = (delay?: boolean) => {
        const newValue = produce(value, (draft: ActionCreateTwitchClipParams) => {
            draft.delay = delay;
        });
        onChange(newValue);
    };
    const onNotifyChange = (notify?: boolean) => {
        const newValue = produce(value, (draft: ActionCreateTwitchClipParams) => {
            draft.notify = notify;
        });
        onChange(newValue);
    };
    const onChannelChange = () => {
        const newValue = produce(value, (draft: ActionCreateTwitchClipParams) => {
            draft.channel = channel;
        });
        onChange(newValue);
    };
    return (
        <div>
            <div>
                Clip <SimpleInput
                    style={{ width: "100px" }}
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    onBlur={onChannelChange}
                />
                {"'s channel "}
                <InlineDropdown
                    value={Boolean(value.delay)}
                    onChange={onDelayChange}
                    options={[
                        {
                            key: "immediate-clip",
                            value: false,
                            text: "immediately",
                        },
                        {
                            key: "delayed-clip",
                            value: true,
                            text: "after a delay",
                        },
                    ]}
                />
                {" and "}
                <InlineDropdown
                    value={Boolean(value.notify)}
                    onChange={onNotifyChange}
                    options={[
                        {
                            key: "notify-me",
                            value: true,
                            text: "notify",
                        },
                        {
                            key: "dont-notify-me",
                            value: false,
                            text: "don't notify",
                        },
                    ]}
                />
                {" me about it"}
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
