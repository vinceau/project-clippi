import * as React from "react";

import styled from "styled-components";

import { useDispatch, useSelector } from "react-redux";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

import { soundPlayer } from "@/lib/sounds";

import { FormContainer, PageHeader } from "@/components/Form";
import { SoundFileInfo } from "@/components/SoundFileInfo";
import { openFileOrParentFolder } from "@/lib/utils";
import { Dispatch, dispatcher, iRootState } from "@/store";
import { device } from "@/styles/device";

const AddSoundButton = (props: any) => {
    return (
        <Button {...props}>
            <Icon name="add" />
            Add sound
        </Button>
    );
};

const ButtonContainer = styled.div`
margin-bottom: 1rem;

button {
    width: 100% !important;
    margin-bottom: 0.25em !important;
    @media ${device.tablet} {
        width: auto !important;
    }
}
`;

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
                        <ButtonContainer>
                            <AddSoundButton
                                onClick={() => dispatch.filesystem.addSound()}
                            />
                            <Button onClick={() => soundPlayer.stop()}>
                                <Icon name="stop" />
                                Stop current sound
                            </Button>
                        </ButtonContainer>
                        <SoundTable onPathClick={onOpenFile} onRemove={removeSound} sounds={soundFiles} />
                    </>
                    :
                    <Segment placeholder>
                        <Header icon>
                            <Icon name="music" />
                        You have not added any sounds
                        </Header>
                        <AddSoundButton
                            onClick={() => dispatch.filesystem.addSound()}
                            primary={true}
                        />
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
