import * as React from "react";

import { ActionTypeGenerator } from "@vinceau/event-actions";
import { produce } from "immer";
import { useSelector } from "react-redux";
import { Button } from "semantic-ui-react";

import { InlineDropdown } from "@/components/Misc/InlineInputs";
import { CustomIcon } from "@/components/Misc/Misc";
import { connectToOBSAndNotify, getAllScenes, setScene } from "@/lib/obs";
import { iRootState } from "@/store";
import { ActionComponent } from "./types";

import obsIcon from "@/styles/images/obs.svg";
import { notify } from "@/lib/utils";

interface ActionChangeSceneParams {
    scene: string;
}

const actionChangeScene: ActionTypeGenerator = (params: ActionChangeSceneParams) => {
    return async (): Promise<void> => {
        try {
            await setScene(params.scene);
        } catch (err) {
            console.error(err);
            notify("Could not change scene. Are you connected to OBS?");
        }
    };
};

const ActionIcon = () => {
    return (
        <CustomIcon size={20} image={obsIcon} color="black" />
    );
};

const snippet = (params: ActionChangeSceneParams): string => {
    return `change scene to ${params.scene}`;
};

const SceneNameInput = (props: any) => {
    const { value, onChange } = props;
    const { obsConnected } = useSelector((state: iRootState) => state.tempContainer);
    if (!obsConnected) {
        return (
            <Button content={`Connect to OBS`} type="button" onClick={connectToOBSAndNotify} />
        );
    }

    const allScenes = getAllScenes();
    if (allScenes.length === 0) {
        return (<div>No scene items found.</div>);
    }

    const onSceneChange = (scene: string) => {
        const newValue = produce(value, (draft: ActionChangeSceneParams) => {
            draft.scene = scene;
        });
        onChange(newValue);
    };
    return (
        <InlineDropdown
            value={value.scene}
            prefix="Scene: "
            onChange={onSceneChange}
            customOptions={allScenes}
        />
    );
};

export const ActionChangeScene: ActionComponent = {
    label: "change OBS scene",
    action: actionChangeScene,
    snippet,
    Icon: ActionIcon,
    Component: SceneNameInput,
};
