import * as React from "react";

import { useDispatch, useSelector } from "react-redux";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

import { soundPlayer } from "@/lib/sounds";

import { FormContainer, PageHeader } from "@/components/Form";
import { SoundFileInfo } from "@/components/SoundFileInfo";
import { Dispatch, dispatcher, iRootState } from "@/store";
import { openFileOrParentFolder } from "@/lib/utils";

export const AddSoundButton = (props: any) => {
    return (
        <Button onClick={() => dispatcher.filesystem.addSound()} {...props}>
            <Icon name="add" />
            Add sound
        </Button>
    );
};

export const SoundSettings: React.FC = () => {
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
            <div style={{ paddingBottom: "50px" }}>
                {soundsExist ?
                    <>
                        <div style={{ marginBottom: "10px" }}>
                            <AddSoundButton />
                            <Button onClick={() => soundPlayer.stop()}>
                                <Icon name="stop" />
                            Stop current sound
                        </Button>
                        </div>
                        <SoundTable onPathClick={onOpenFile} onRemove={removeSound} sounds={soundFiles} />
                    </>
                    :
                    <Segment placeholder>
                        <Header icon>
                            <Icon name="music" />
                        You have not added any sounds
                        </Header>
                        <AddSoundButton primary={true} />
                    </Segment>
                }
            </div>
        </FormContainer>
    );
};

const SoundTable: React.FC<{
    sounds: { [name: string]: string };
    onPathClick: (name: string) => void;
    onRemove: (name: string) => void;
}> = props => {
    const allSounds = Object.keys(props.sounds);
    allSounds.sort();
    return (
        <div>
            {allSounds.map(key => {
                const value = props.sounds[key];
                return <SoundFileInfo
                    key={`${value}--${key}`}
                    name={key}
                    path={value}
                    onPathClick={() => props.onPathClick(key)}
                    onRemove={() => props.onRemove(key)}
                />;
            })}
        </div>
    );
};
