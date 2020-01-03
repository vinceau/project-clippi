import * as React from "react";

import { ActionTypeGenerator } from "@vinceau/event-actions";
import { produce } from "immer";
import { Icon } from "semantic-ui-react";

import { notify } from "@/lib/utils";
import { dispatcher, store } from "../store";
import { ActionComponent } from "./types";
import { InlineDropdown } from "@/components/InlineInputs";
import { CustomIcon } from "@/components/Misc";

import obsIcon from "../styles/images/obs.svg";

interface ActionChangeSceneParams {
    scene: string;
}

const actionChangeScene: ActionTypeGenerator = (params: ActionChangeSceneParams) => {
    return async (): Promise<void> => {
        console.log("changing scene");
    };
};

const ActionIcon = () => {
    return (
        <CustomIcon size={20} image={obsIcon} color="black" />
    );
};

const SceneNameInput = (props: any) => {
    const { value, onChange } = props;
    // const soundFiles = useSelector((state: iRootState) => state.filesystem.soundFiles);
    const allScenes = ["abc", "def"]; // Object.keys(soundFiles);
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
            prefix="Play"
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
