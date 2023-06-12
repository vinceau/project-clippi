import { delay as waitMillis } from "common/utils";
import { produce } from "immer";
import * as React from "react";
import { useSelector } from "react-redux";
import { Button } from "semantic-ui-react";

import { CustomIcon } from "@/components/CustomIcon";
import { DelayInput, InlineDropdown } from "@/components/InlineInputs";
import type { ActionTypeGenerator, Context } from "@/lib/event_actions";
import { connectToOBSAndNotify, getAllScenes, obsConnection, OBSConnectionStatus } from "@/lib/obs";
import { notify } from "@/lib/utils";
import type { iRootState } from "@/store";
import obsIcon from "@/styles/images/obs.svg";

import type { ActionComponent } from "./types";

interface ActionChangeSceneParams {
  scene: string;
  delay?: string; // delay in milliseconds string
}

const actionChangeScene: ActionTypeGenerator = (params: ActionChangeSceneParams) => {
  return async (ctx: Context): Promise<Context> => {
    try {
      const millis = parseInt(params.delay || "0", 10);
      if (millis > 0) {
        await waitMillis(millis);
      }
      await obsConnection.setScene(params.scene);
    } catch (err) {
      console.error(err);
      notify("Could not change scene. Are you connected to OBS?");
    }
    return ctx;
  };
};

const ActionIcon = () => {
  return <CustomIcon image={obsIcon} size="large" />;
};

const SceneNameInput = (props: any) => {
  const { value, onChange } = props;
  const { obsConnectionStatus, obsScenes } = useSelector((state: iRootState) => state.tempContainer);
  const obsConnected = obsConnectionStatus === OBSConnectionStatus.CONNECTED;

  if (!obsConnected) {
    return <Button content={`Connect to OBS`} type="button" onClick={connectToOBSAndNotify} />;
  }

  const allScenes = getAllScenes(obsScenes);
  if (allScenes.length === 0) {
    return <div>No scene items found.</div>;
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
