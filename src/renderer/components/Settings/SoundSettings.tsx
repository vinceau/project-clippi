import * as React from "react";

import { useDispatch, useSelector } from "react-redux";
import { Button, Header, Icon, Segment, Table } from "semantic-ui-react";

import { soundPlayer } from "@/lib/sounds";

import { Dispatch, dispatcher, iRootState } from "@/store";
import { shell } from "electron";
import { openFileOrParentFolder } from "../../lib/utils";

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
    const onPlay = (name: string) => {
        const filePath = soundPlayer.getSoundPath(name);
        if (filePath) {
            shell.openItem(filePath);
        }
    };
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
        <div style={{paddingBottom: "100px"}}>
            <h2>Sounds</h2>
            {soundsExist ?
                <>
                    <div style={{marginBottom: "10px"}}>
                        <AddSoundButton />
                        <Button onClick={() => soundPlayer.stop()}>
                            <Icon name="stop" />
                            Stop current sound
                    </Button>
                    </div>
                    <SoundTable onPathClick={onOpenFile} onPlay={onPlay} onRemove={removeSound} sounds={soundFiles} />
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
    );
};

const SoundRow: React.FC<{
    name: string;
    path: string;
    onPathClick: () => void;
    onPlay: () => void;
    onRemove: () => void;
}> = props => {
    const pathClick = (e: any) => {
        e.preventDefault();
        props.onPathClick();
    };
    return (
        <Table.Row key={props.path}>
            <Table.Cell>
                {props.name}
            </Table.Cell>
            <Table.Cell>
                <a href="#" onClick={pathClick}>{props.path}</a>
            </Table.Cell>
            <Table.Cell>
                <Icon name="play" link onClick={props.onPlay}/>
            </Table.Cell>
            <Table.Cell>
                <Icon name="trash" link onClick={props.onRemove}/>
            </Table.Cell>
        </Table.Row>
    );
};

const SoundTable: React.FC<{
    sounds: { [name: string]: string };
    onPlay: (name: string) => void;
    onPathClick: (name: string) => void;
    onRemove: (name: string) => void;
}> = props => {
    const rows: JSX.Element[] = [];
    const allSounds = Object.keys(props.sounds);
    allSounds.sort();
    for (const key of allSounds) {
        const value = props.sounds[key];
        rows.push((
            <SoundRow
                key={`${value}--${key}`}
                name={key}
                path={value}
                onPlay={() => props.onPlay(key)}
                onPathClick={() => props.onPathClick(key)}
                onRemove={() => props.onRemove(key)}
            />
        ));
    }
    return (
        <div>
            <Table celled padded>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell singleLine>Name</Table.HeaderCell>
                        <Table.HeaderCell>File Path</Table.HeaderCell>
                        <Table.HeaderCell>Play</Table.HeaderCell>
                        <Table.HeaderCell>Remove</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {rows}
                </Table.Body>
            </Table>
        </div>
    );
};
