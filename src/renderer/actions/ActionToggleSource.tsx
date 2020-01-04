import * as React from "react";

import { ActionTypeGenerator } from "@vinceau/event-actions";
import { produce } from "immer";
import { useSelector } from "react-redux";
import { Button } from "semantic-ui-react";

import { InlineDropdown } from "@/components/Misc/InlineInputs";
import { CustomIcon } from "@/components/Misc/Misc";
import { connectToOBSAndNotify, getAllSceneItems, setSourceItemVisibility } from "@/lib/obs";
import { iRootState } from "@/store";
import { ActionComponent } from "./types";

import obsIcon from "@/styles/images/obs.svg";
import { notify } from "@/lib/utils";

interface ActionToggleSourceParams {
    source: string;
    visible?: boolean;
}

const actionToggleSource: ActionTypeGenerator = (params: ActionToggleSourceParams) => {
    return async (): Promise<void> => {
        try {
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

const Snippet: React.FC<{value: ActionToggleSourceParams}> = props => {
    if (!props.value || !props.value.source) {
        return <div>toggle OBS source</div>
    }
    return <div>{props.value.visible ? "show" : "hide"} <b>{props.value.source}</b></div>;
};

const SourceNameInput = (props: { value: ActionToggleSourceParams, onChange: any}) => {
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
    return (
        <span>
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
        </span>
    );
};

export const ActionToggleSource: ActionComponent = {
    label: "toggle OBS source",
    action: actionToggleSource,
    Snippet,
    Icon: ActionIcon,
    Component: SourceNameInput,
};
