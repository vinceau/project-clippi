import { delay as waitMillis, parseSecondsDelayValue } from "common/utils";
import { produce } from "immer";
import * as React from "react";

import { CustomIcon } from "@/components/CustomIcon";
import { DelayInput, NotifyInput } from "@/components/InlineInputs";
import type { ActionTypeGenerator, Context } from "@/lib/event_actions";
import { obsConnection } from "@/lib/obs";
import { notify as sendNotification } from "@/lib/utils";
import obsIcon from "@/styles/images/obs.svg";

import type { ActionComponent } from "./types";

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
      await obsConnection.saveReplayBuffer();
      if (params.notify) {
        sendNotification("Saved replay buffer");
      }
    } catch (err) {
      console.error(err);
      sendNotification("Failed to save Replay Buffer. Is Replay Buffer on and a Save Replay Buffer hotkey assigned?");
    }
    return ctx;
  };
};

const ActionIcon = () => {
  return <CustomIcon image={obsIcon} size="large" />;
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
