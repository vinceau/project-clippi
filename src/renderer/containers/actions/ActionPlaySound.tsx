import { produce } from "immer";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/ui/Button/Button";
import { InlineDropdown } from "@/components/InlineInputs";
import type { ActionTypeGenerator, Context } from "@/lib/event_actions";
import { soundPlayer } from "@/lib/sounds";
import type { Dispatch, iRootState } from "@/store";

import { Plus, Music } from "lucide-react";
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

function ActionIcon() {
  return <Music size={20} />;
}

function PlaySoundInput(props: any) {
  const { value, onChange } = props;
  const soundFiles = useSelector((state: iRootState) => state.filesystem.soundFiles);
  const dispatch = useDispatch<Dispatch>();
  const allSounds = Object.keys(soundFiles);
  if (allSounds.length === 0) {
    return (
      <Button
        onClick={async () => {
          const name = await dispatch.filesystem.addSound();
          if (name) {
            const newValue = produce(value, (draft: ActionPlaySoundParams) => {
              draft.sound = name;
            });
            onChange(newValue);
          }
        }}
      >
        <Plus size={20} />
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
}

export const ActionPlaySound: ActionComponent = {
  label: "play a sound",
  action: ActionPlaySoundFunc,
  Icon: ActionIcon,
  Component: PlaySoundInput,
};
