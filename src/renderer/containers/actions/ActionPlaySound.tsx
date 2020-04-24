import * as React from "react";

import { ActionTypeGenerator, Context } from "@vinceau/event-actions";
import {produce} from "immer";
import { useSelector } from "react-redux";
import { Icon } from "semantic-ui-react";

import { InlineDropdown } from "@/components/InlineInputs";
import { AddSoundButton } from "@/containers/settings/SoundSettings";
import { soundPlayer } from "@/lib/sounds";
import { iRootState } from "@/store";
import { ActionComponent } from "./types";

interface ActionPlaySoundParams {
    sound: string;
}

const ActionPlaySoundFunc: ActionTypeGenerator = (params: ActionPlaySoundParams) => {
    return async (ctx: Context): Promise<Context> => {
        await soundPlayer.playSound(params.sound);
        return ctx;
    };
};

const ActionIcon = () => {
    return (
        <Icon name="music" size="large" />
    );
};

const PlaySoundInput = (props: any) => {
    const { value, onChange } = props;
    const soundFiles = useSelector((state: iRootState) => state.filesystem.soundFiles);
    const allSounds = Object.keys(soundFiles);
    if (allSounds.length === 0) {
        return (
            <AddSoundButton />
        );
    }

    const onSoundChange = (sound: string) => {
        const newValue = produce(value, (draft: ActionPlaySoundParams) => {
            draft.sound = sound;
        });
        onChange(newValue);
    };
    return (
        <InlineDropdown
            value={value.sound}
            prefix="Play"
            onChange={onSoundChange}
            customOptions={allSounds}
        />
    );
};

export const ActionPlaySound: ActionComponent = {
    label: "play a sound",
    action: ActionPlaySoundFunc,
    Icon: ActionIcon,
    Component: PlaySoundInput,
};
