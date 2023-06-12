import { delay as waitMillis } from "common/utils";
import { produce } from "immer";
import * as React from "react";
import { useSelector } from "react-redux";
import { Button } from "semantic-ui-react";

import { CustomIcon } from "@/components/CustomIcon";
import { DelayInput, InlineDropdown } from "@/components/InlineInputs";
import type { ActionTypeGenerator, Context } from "@/lib/event_actions";
import { connectToOBSAndNotify, getAllSceneItems, obsConnection, OBSConnectionStatus } from "@/lib/obs";
import { notify } from "@/lib/utils";
import type { iRootState } from "@/store";
import obsIcon from "@/styles/images/obs.svg";

import type { ActionComponent } from "./types";

interface ActionToggleSourceParams {
  source: string;
  visible?: boolean;
  delay?: string;
}

const actionToggleSource: ActionTypeGenerator = (params: ActionToggleSourceParams) => {
  return async (ctx: Context): Promise<Context> => {
    try {
      const millis = parseInt(params.delay || "0", 10);
      if (millis > 0) {
        await waitMillis(millis);
      }
      await obsConnection.setSourceItemVisibility(params.source, params.visible);
    } catch (err) {
      console.error(err);
      notify("Could not set source visibility. Are you connected to OBS?");
    }
    return ctx;
  };
};

const ActionIcon = () => {
  return <CustomIcon image={obsIcon} size="large" />;
};

const SourceNameInput = (props: { value: ActionToggleSourceParams; onChange: any }) => {
  const { value, onChange } = props;
  const { obsConnectionStatus, obsScenes } = useSelector((state: iRootState) => state.tempContainer);
  const obsConnected = obsConnectionStatus === OBSConnectionStatus.CONNECTED;

  if (!obsConnected) {
    return <Button content={`Connect to OBS`} type="button" onClick={connectToOBSAndNotify} />;
  }

  const allSources = getAllSceneItems(obsScenes);
  if (allSources.length === 0) {
    return <div>No scene items found.</div>;
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
        {" after a "}
        <DelayInput value={value.delay} onChange={onDelayChange} />
        {" millisecond delay"}
      </div>
    </div>
  );
};

export const ActionToggleSource: ActionComponent = {
  label: "toggle OBS source",
  action: actionToggleSource,
  Icon: ActionIcon,
  Component: SourceNameInput,
};
