import type { ActionTypeGenerator, Context } from "@vinceau/event-actions";
import { produce } from "immer";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon } from "semantic-ui-react";

import { InlineDropdown } from "@/components/InlineInputs";
import { soundPlayer } from "@/lib/sounds";
import type { Dispatch, iRootState } from "@/store";

import type { ActionComponent } from "./types";

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
  return <Icon name="music" size="large" />;
};

const PlaySoundInput = (props: any) => {
  const { value, onChange } = props;
  const soundFiles = useSelector((state: iRootState) => state.filesystem.soundFiles);
  const dispatch = useDispatch<Dispatch>();
  const allSounds = Object.keys(soundFiles);
  if (allSounds.length === 0) {
    return (
      <Button onClick={() => dispatch.filesystem.addSound()}>
        <Icon name="add" />
        Add sound
      </Button>
    );
  }

  const onSoundChange = (sound: string) => {
    const newValue = produce(value, (draft: ActionPlaySoundParams) => {
      draft.sound = sound;
    });
    onChange(newValue);
  };
  return <InlineDropdown value={value.sound} prefix="Play" onChange={onSoundChange} customOptions={allSounds} />;
};

export const ActionPlaySound: ActionComponent = {
  label: "play a sound",
  action: ActionPlaySoundFunc,
  Icon: ActionIcon,
  Component: PlaySoundInput,
};
