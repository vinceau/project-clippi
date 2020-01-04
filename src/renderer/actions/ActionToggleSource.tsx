import * as React from "react";

import { ActionTypeGenerator } from "@vinceau/event-actions";
import { produce } from "immer";
import { useSelector } from "react-redux";
import { Button } from "semantic-ui-react";

import { InlineDropdown } from "@/components/Misc/InlineInputs";
import { CustomIcon } from "@/components/Misc/Misc";
import { connectToOBSAndNotify, getAllSceneItems, setSourceItemVisibility } from "@/lib/obs";
import { delay as waitMillis, notify } from "@/lib/utils";
import { iRootState } from "@/store";
import { DelayInput } from "./ActionChangeScene";
import { ActionComponent } from "./types";

import obsIcon from "@/styles/images/obs.svg";

interface ActionToggleSourceParams {
    source: string;
    visible?: boolean;
    delay?: string;
}

const actionToggleSource: ActionTypeGenerator = (params: ActionToggleSourceParams) => {
    return async (): Promise<void> => {
        try {
            const millis = parseInt(params.delay || "0", 10);
            if (millis > 0) {
                await waitMillis(millis);
            }
            await setSourceItemVisibility(params.source, params.visible);
        } catch (err) {
            console.error(err);
            notify("Could not set source visibility. Are you connected to OBS?");
        }
    };
};

const ActionIcon = () => {
    return (
        <CustomIcon size={20} image={obsIcon} color="black" />
    );
};

const SourceNameInput = (props: { value: ActionToggleSourceParams, onChange: any }) => {
    const { value, onChange } = props;
    const { obsConnected } = useSelector((state: iRootState) => state.tempContainer);
    if (!obsConnected) {
        return (
            <Button content={`Connect to OBS`} type="button" onClick={connectToOBSAndNotify} />
        );
    }

    const allSources = getAllSceneItems();
    if (allSources.length === 0) {
        return (<div>No scene items found.</div>);
    }

    const onSourceChange = (source: string) => {
        const newValue = produce(value, (draft) => {
            draft.source = source;
        });
        onChange(newValue);
    };
    const onVisibilityChange = (visible: boolean) => {
        const newValue = produce(value, (draft) => {
            draft.visible = visible;
        });
        onChange(newValue);
    };

    const onDelayChange = (delay: string) => {
        const newValue = produce(value, (draft: ActionToggleSourceParams) => {
            draft.delay = delay;
        });
        onChange(newValue);
    };
    return (
        <div>
            <div>
                <InlineDropdown
                    value={Boolean(value.visible)}
                    onChange={onVisibilityChange}
                    options={[
                        {
                            key: "hide",
                            value: false,
                            text: "Hide ",
                        },
                        {
                            key: "show",
                            value: true,
                            text: "Show ",
                        },
                    ]}
                />
                <InlineDropdown
                    value={value.source}
                    prefix=" the source "
                    onChange={onSourceChange}
                    customOptions={allSources}
                />
            </div>
            <DelayInput value={value.delay} onChange={onDelayChange} />
        </div>
    );
};

export const ActionToggleSource: ActionComponent = {
    label: "toggle OBS source",
    action: actionToggleSource,
    Icon: ActionIcon,
    Component: SourceNameInput,
};
