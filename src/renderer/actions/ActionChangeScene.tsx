import * as React from "react";

import { InlineDropdown } from "@/components/Misc/InlineInputs";
import { iRootState } from "@/store";
import { ActionTypeGenerator } from "@vinceau/event-actions";
import { produce } from "immer";
import { useSelector } from "react-redux";

import { CustomIcon } from "@/components/Misc/Misc";
import { setScene } from "@/lib/obs";
import { ActionComponent } from "./types";

import obsIcon from "../styles/images/obs.svg";

interface ActionChangeSceneParams {
    scene: string;
}

const actionChangeScene: ActionTypeGenerator = (params: ActionChangeSceneParams) => {
    return async (): Promise<void> => {
        await setScene(params.scene);
    };
};

const ActionIcon = () => {
    return (
        <CustomIcon size={20} image={obsIcon} color="black" />
    );
};

const SceneNameInput = (props: any) => {
    const { value, onChange } = props;
    const allScenes = useSelector((state: iRootState) => state.tempContainer.obsScenes);
    if (allScenes.length === 0) {
        return (
            <span>No scenes available</span>
        );
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
            options={allScenes}
        />
    );
};

export const ActionChangeScene: ActionComponent = {
    label: "change OBS scene",
    action: actionChangeScene,
    Icon: ActionIcon,
    Component: SceneNameInput,
};
