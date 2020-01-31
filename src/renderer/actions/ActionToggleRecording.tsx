import * as React from "react";

import { ActionTypeGenerator, Context } from "@vinceau/event-actions";
import { produce } from "immer";

import { DelayInput, InlineDropdown, NotifyInput } from "@/components/Misc/InlineInputs";
import { CustomIcon } from "@/components/Misc/Misc";
import { OBSRecordingAction, setRecordingState } from "@/lib/obs";
import { capitalize, delay as waitMillis, notify, parseSecondsDelayValue } from "@/lib/utils";
import { ActionComponent } from "./types";

import obsIcon from "@/styles/images/obs.svg";

const DEFAULT_DELAY_SECONDS = 10;

const obsRecordingLabel = (action: OBSRecordingAction): string => {
    switch (action) {
        case OBSRecordingAction.TOGGLE:
            return "toggle";
        case OBSRecordingAction.START:
            return "start";
        case OBSRecordingAction.STOP:
            return "stop";
        default:
            console.error(`Unknown OBS action: ${action}`);
            return "";
    }
};

const pastObsRecordingLabel = (action: OBSRecordingAction): string => {
    switch (action) {
        case OBSRecordingAction.TOGGLE:
            return "toggled";
        case OBSRecordingAction.START:
            return "started";
        case OBSRecordingAction.STOP:
            return "stopped";
        default:
            console.error(`Unknown OBS action: ${action}`);
            return "";
    }
};

const recordActions = [
    OBSRecordingAction.TOGGLE,
    OBSRecordingAction.START,
    OBSRecordingAction.STOP,
].map(a => ({
    key: obsRecordingLabel(a),
    value: a,
    text: capitalize(obsRecordingLabel(a)) + " ",
}));

interface ActionToggleRecordingParams {
    recordAction: OBSRecordingAction;
    notify?: boolean;
    delaySeconds?: string;
}

const defaultParams = (): ActionToggleRecordingParams => {
    return {
        recordAction: OBSRecordingAction.TOGGLE,
        delaySeconds: DEFAULT_DELAY_SECONDS.toString(),
        notify: false,
    };
};

const actionToggleRecording: ActionTypeGenerator = (params: ActionToggleRecordingParams) => {
    return async (ctx: Context): Promise<Context> => {
        try {
            const seconds = parseSecondsDelayValue(DEFAULT_DELAY_SECONDS, params.delaySeconds);
            if (seconds > 0) {
                await waitMillis(seconds * 1000);
            }
            await setRecordingState(params.recordAction);
            if (params.notify) {
                notify(`${capitalize(pastObsRecordingLabel(params.recordAction))} OBS recording`);
            }
        } catch (err) {
            console.error(err);
            notify(`Failed to ${obsRecordingLabel(params.recordAction)} OBS recording: ${err.error}`);
        }
        return ctx;
    };
};

const ActionIcon = () => {
    return (
        <CustomIcon size={20} image={obsIcon} color="black" />
    );
};

const RecordingNameInput = (props: { value: ActionToggleRecordingParams, onChange: any }) => {
    const { value, onChange } = props;

    const onRecordingChange = (rec: OBSRecordingAction) => {
        const newValue = produce(value, (draft) => {
            draft.recordAction = rec;
        });
        onChange(newValue);
    };
    const onNotifyChange = (notify: boolean) => {
        const newValue = produce(value, (draft) => {
            draft.notify = notify;
        });
        onChange(newValue);
    };

    const onDelayChange = (delay: string) => {
        const newValue = produce(value, (draft: ActionToggleRecordingParams) => {
            draft.delaySeconds = delay;
        });
        onChange(newValue);
    };
    return (
        <div>
            <div>
                <InlineDropdown
                    value={value.recordAction}
                    onChange={onRecordingChange}
                    options={recordActions}
                />
                {" the OBS recording after a "}
                <DelayInput value={value.delaySeconds} onChange={onDelayChange} placeholder={`${DEFAULT_DELAY_SECONDS}`} />
                {" second delay and "}
                <NotifyInput value={value.notify} onChange={onNotifyChange} />
                {" me about it"}
            </div>
        </div>
    );
};

export const ActionToggleRecording: ActionComponent = {
    label: "toggle OBS recording",
    action: actionToggleRecording,
    Icon: ActionIcon,
    Component: RecordingNameInput,
    defaultParams,
};
