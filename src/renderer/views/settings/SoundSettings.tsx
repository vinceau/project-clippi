import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/ui/Button/Button";
import { Header } from "@/ui/Header/Header";
import { Segment } from "@/ui/Segment/Segment";

import { FormContainer, PageHeader } from "@/components/Form";
import { SoundFileInfo } from "@/components/SoundFileInfo";
import { soundPlayer } from "@/lib/sounds";
import { openFileOrParentFolder } from "@/lib/utils";
import type { Dispatch, iRootState } from "@/store";

import { CircleStop, Music, Plus } from "lucide-react";
import styles from "./SoundSettings.module.css";

function AddSoundButton(props: any) {
  return (
    <Button {...props}>
      <Plus size={20} />
      Add sound
    </Button>
  );
}

export function SoundSettings() {
  const soundFiles = useSelector((state: iRootState) => state.filesystem.soundFiles);
  const soundsExist = Object.keys(soundFiles).length > 0;
  const dispatch = useDispatch<Dispatch>();
  const onOpenFile = (name: string) => {
    const filePath = soundPlayer.getSoundPath(name);
    if (filePath) {
      openFileOrParentFolder(filePath);
    }
  };
  const removeSound = (name: string) => {
    dispatch.filesystem.removeSound(name);
  };
  return (
    <FormContainer>
      <PageHeader>Sounds</PageHeader>
      <div className={styles.content}>
        {soundsExist ? (
          <>
            <div className={styles.buttonContainer}>
              <AddSoundButton onClick={() => dispatch.filesystem.addSound()} />
              <Button onClick={() => soundPlayer.stop()}>
                <CircleStop size={20} />
                Stop current sound
              </Button>
            </div>
            <SoundTable onPathClick={onOpenFile} onRemove={removeSound} sounds={soundFiles} />
          </>
        ) : (
          <Segment placeholder>
            <Header icon vertical>
              <Music size={64} />
              You have not added any sounds
            </Header>
            <AddSoundButton onClick={() => dispatch.filesystem.addSound()} primary />
          </Segment>
        )}
      </div>
    </FormContainer>
  );
}

function SoundTable({
  sounds,
  onPathClick,
  onRemove,
}: {
  sounds: { [name: string]: string };
  onPathClick: (name: string) => void;
  onRemove: (name: string) => void;
}) {
  const allSounds = Object.keys(sounds);
  allSounds.sort();
  return (
    <div>
      {allSounds.map((key) => {
        const value = sounds[key];
        return (
          <SoundFileInfo
            key={`${value}--${key}`}
            name={key}
            path={value}
            onPathClick={() => onPathClick(key)}
            onRemove={() => onRemove(key)}
          />
        );
      })}
    </div>
  );
}
