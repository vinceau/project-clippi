import * as React from "react";

import { ActionTypeGenerator, Context } from "@vinceau/event-actions";
import { produce } from "immer";

import { DelayInput, InlineDropdown } from "@/components/Misc/InlineInputs";
import { delay as waitMillis, notify as sendNotification } from "@/lib/utils";
import { ActionComponent } from "./types";

import { CustomIcon } from "@/components/Misc/Misc";
import { saveReplayBuffer } from "@/lib/obs";

import obsIcon from "@/styles/images/obs.svg";

const DEFAULT_DELAY_SECONDS = 10;

interface ActionSaveReplayBufferParams {
    delaySeconds?: string;
    notify?: boolean;
}

const defaultParams = (): ActionSaveReplayBufferParams => {
    return {
        delaySeconds: DEFAULT_DELAY_SECONDS.toString(),
        notify: true,
    };
};

const parseDelayValue = (delay?: string): number => {
    let seconds = parseInt(delay || DEFAULT_DELAY_SECONDS.toString(), 10);
    if (isNaN(seconds)) {
        seconds = DEFAULT_DELAY_SECONDS;
    }
    return seconds;
};

const actionSaveBuffer: ActionTypeGenerator = (params: ActionSaveReplayBufferParams) => {
    return async (ctx: Context): Promise<Context> => {
        try {
            const seconds = parseDelayValue(params.delaySeconds);
            if (seconds > 0) {
                await waitMillis(seconds * 1000);
            }
            await saveReplayBuffer();
            if (params.notify) {
                sendNotification("Saved replay buffer");
            }
        } catch (err) {
            console.error(err);
            sendNotification("Failed to save replay buffer. Is replay buffer on?");
        }
        return ctx;
    };
};

const ActionIcon = () => {
    return (
        <CustomIcon size={20} image={obsIcon} color="black" />
    );
};

interface ReplayBufferInputProps extends Record<string, any> {
    value: ActionSaveReplayBufferParams;
    onChange(value: ActionSaveReplayBufferParams): void;
}

const ReplayBufferInput = (props: ReplayBufferInputProps) => {
    const { value, onChange } = props;
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
    return (
        <div>
            <div>
                {"Save the OBS replay buffer after a "}
                <DelayInput value={value.delaySeconds} onChange={onDelayChange} placeholder={`${DEFAULT_DELAY_SECONDS}`} />
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

export const ActionSaveReplayBuffer: ActionComponent = {
    label: "save OBS replay buffer",
    action: actionSaveBuffer,
    Icon: ActionIcon,
    Component: ReplayBufferInput,
    defaultParams,
};
