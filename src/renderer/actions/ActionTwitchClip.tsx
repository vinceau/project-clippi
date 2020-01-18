import * as React from "react";

import { ActionTypeGenerator, Context } from "@vinceau/event-actions";
import { produce } from "immer";
import { Icon } from "semantic-ui-react";

import { DelayInput, InlineDropdown, SimpleInput } from "@/components/Misc/InlineInputs";
import { delay as waitMillis, notify as sendNotification } from "@/lib/utils";
import { createTwitchClip } from "common/twitch";
import { dispatcher, store } from "../store";
import { ActionComponent } from "./types";

const DEFAULT_DELAY_SECONDS = 20;

interface ActionCreateTwitchClipParams {
    delaySeconds?: string;
    notify?: boolean;
    channel?: string;
}

const defaultParams = (): ActionCreateTwitchClipParams => {
    const user = store.getState().tempContainer.twitchUser;
    const channel = user ? user.name : "";
    return {
        delaySeconds: DEFAULT_DELAY_SECONDS.toString(),
        notify: true,
        channel,
    };
};

const parseDelayValue = (delay?: string): number => {
    let seconds = parseInt(delay || DEFAULT_DELAY_SECONDS.toString(), 10);
    if (isNaN(seconds)) {
        seconds = DEFAULT_DELAY_SECONDS;
    }
    return seconds;
};

const actionCreateClip: ActionTypeGenerator = (params: ActionCreateTwitchClipParams) => {
    return async (ctx: Context): Promise<Context> => {
        const token = store.getState().twitch.authToken;
        try {
            const seconds = parseDelayValue(params.delaySeconds);
            if (seconds > 0) {
                await waitMillis(seconds * 1000);
            }
            const clipID = await createTwitchClip(token, false, params.channel);
            // Get timestamp in seconds
            const timestamp = (new Date()).getTime() / 1000;
            dispatcher.twitch.addTwitchClip({
                clipID,
                timestamp,
            });
            if (params.notify) {
                sendNotification(`Clipped ${clipID}`, "Twitch clip created");
            }
            return {
                ...ctx,
                clipID,
            };
        } catch (err) {
            console.error(err);
            sendNotification(`Failed to clip. ${params.channel ? "Is " + params.channel : "Are you"} live?`);
            return ctx;
        }
    };
};

const ActionIcon = () => {
    return (
        <Icon name="twitch" size="large" />
    );
};

interface TwitchClipInputProps extends Record<string, any> {
    value: ActionCreateTwitchClipParams;
    onChange(value: ActionCreateTwitchClipParams): void;
}

const TwitchClipInput = (props: TwitchClipInputProps) => {
    const { value, onChange } = props;
    const [channel, setChannel] = React.useState<string>(value.channel || "");
    const onDelayChange = (delay?: string) => {
        const newValue = produce(value, (draft) => {
            draft.delaySeconds = delay;
        });
        onChange(newValue);
    };
    const onNotifyChange = (notify?: boolean) => {
        const newValue = produce(value, (draft) => {
            draft.notify = notify;
        });
        onChange(newValue);
    };
    const onChannelChange = () => {
        const newValue = produce(value, (draft) => {
            draft.channel = channel;
        });
        onChange(newValue);
    };
    return (
        <div>
            <div>
                Clip the <SimpleInput
                    style={{ width: "100px" }}
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    onBlur={onChannelChange}
                />
                {" channel after a "}
                <DelayInput value={value.delaySeconds} onChange={onDelayChange} placeholder="20" />
                {" second delay and "}
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
