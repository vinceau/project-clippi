import * as React from "react";

import { ActionTypeGenerator } from "@vinceau/event-actions";
import { produce } from "immer";
import { useSelector } from "react-redux";
import { Button } from "semantic-ui-react";

import { InlineDropdown } from "@/components/Misc/InlineInputs";
import { CustomIcon } from "@/components/Misc/Misc";
import { connectToOBSAndNotify } from "@/lib/obs";
import { iRootState } from "@/store";
import { ActionComponent } from "./types";

import obsIcon from "../styles/images/obs.svg";

interface ActionToggleSourceParams {
    Source: string;
}

const actionToggleSource: ActionTypeGenerator = (params: ActionToggleSourceParams) => {
    return async (): Promise<void> => {
        console.log("toggling source");
        // await setSource(params.Source);
    };
};

const ActionIcon = () => {
    return (
        <CustomIcon size={20} image={obsIcon} color="black" />
    );
};

const SourceNameInput = (props: any) => {
    const { value, onChange } = props;
    const allSources: string[] = ["abc", "def"]; //useSelector((state: iRootState) => state.tempContainer.obsSources);
    if (allSources.length === 0) {
        return (
            <Button content={`Connect to OBS`} type="button" onClick={connectToOBSAndNotify} />
        );
    }

    const onSourceChange = (Source: string) => {
        const newValue = produce(value, (draft: ActionToggleSourceParams) => {
            draft.Source = Source;
        });
        onChange(newValue);
    };
    return (
        <InlineDropdown
            value={value.Source}
            prefix="Source: "
            onChange={onSourceChange}
            options={allSources}
        />
    );
};

export const ActionToggleSource: ActionComponent = {
    label: "toggle OBS source",
    action: actionToggleSource,
    Icon: ActionIcon,
    Component: SourceNameInput,
};
