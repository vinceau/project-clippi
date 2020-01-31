import * as React from "react";

import { ActionTypeGenerator, Context } from "@vinceau/event-actions";
import { produce } from "immer";

import { DelayInput, NotifyInput } from "@/components/Misc/InlineInputs";
import { delay as waitMillis, notify as sendNotification, parseSecondsDelayValue } from "@/lib/utils";
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
        notify: false,
    };
};

const actionSaveBuffer: ActionTypeGenerator = (params: ActionSaveReplayBufferParams) => {
    return async (ctx: Context): Promise<Context> => {
        try {
            const seconds = parseSecondsDelayValue(DEFAULT_DELAY_SECONDS, params.delaySeconds);
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
                <NotifyInput value={value.notify} onChange={onNotifyChange} />
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
