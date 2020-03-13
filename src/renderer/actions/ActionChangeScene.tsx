import * as React from "react";

import { ActionTypeGenerator, Context } from "@vinceau/event-actions";
import { produce } from "immer";
import { useSelector } from "react-redux";
import { Button } from "semantic-ui-react";

import { DelayInput, InlineDropdown } from "@/components/InlineInputs";
import { CustomIcon } from "@/components/CustomIcon";
import { connectToOBSAndNotify, getAllScenes, setScene } from "@/lib/obs";
import { delay as waitMillis, notify } from "@/lib/utils";
import { iRootState } from "@/store";
import { ActionComponent } from "./types";
import { useTheme } from "@/styles";

import obsIcon from "@/styles/images/obs.svg";

interface ActionChangeSceneParams {
    scene: string;
    delay?: string;  // delay in milliseconds string
}

const actionChangeScene: ActionTypeGenerator = (params: ActionChangeSceneParams) => {
    return async (ctx: Context): Promise<Context> => {
        try {
            const millis = parseInt(params.delay || "0", 10);
            if (millis > 0) {
                await waitMillis(millis);
            }
            await setScene(params.scene);
        } catch (err) {
            console.error(err);
            notify("Could not change scene. Are you connected to OBS?");
        }
        return ctx;
    };
};

const ActionIcon = () => {
    return (
        <CustomIcon size={20} image={obsIcon} />
    );
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

    const onDelayChange = (delay: string) => {
        const newValue = produce(value, (draft: ActionChangeSceneParams) => {
            draft.delay = delay;
        });
        onChange(newValue);
    };

    return (
        <div>
            <InlineDropdown
                value={value.scene}
                prefix="Change scene to "
                onChange={onSceneChange}
                customOptions={allScenes}
            />
            {" after a "}
            <DelayInput value={value.delay} onChange={onDelayChange} />
            {" millisecond delay"}
        </div>
    );
};

export const ActionChangeScene: ActionComponent = {
    label: "change OBS scene",
    action: actionChangeScene,
    Icon: ActionIcon,
    Component: SceneNameInput,
};
