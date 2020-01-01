import path from "path";
import * as React from "react";

import { useSelector, useDispatch } from "react-redux";
import { Button, Icon, Table } from "semantic-ui-react";

import { sp } from "@/lib/sounds";
import { getFilePath } from "@/lib/utils";
import { iRootState, Dispatch, dispatcher } from "@/store";
import { shell } from "electron";
import styled from "styled-components";

export const addSound = async (): Promise<string> => {
    const p = await getFilePath({
        filters: [{ name: "Audio files", extensions: ["mp3", "wav"] }],
    }, false);
    if (!p) {
        throw new Error("User cancelled selection");
    }
    const name = path.basename(p);
    dispatcher.filesystem.setSound({
        name,
        filePath: p,
    });
    return name;
};

export const AddSoundButton: React.FC = () => {
    return (
        <Button onClick={() => addSound().catch(console.error)}>
            <Icon name="add" />
            Add sound
        </Button>
    );
};

export const SoundSettings: React.FC = () => {
    const soundFiles = useSelector((state: iRootState) => state.filesystem.soundFiles);
    const dispatch = useDispatch<Dispatch>();
    const onPlay = (name: string) => {
        const filePath = sp.getSoundPath(name);
        if (filePath) {
            shell.openItem(filePath);
        }
    };
    const removeSound = (name: string) => {
        dispatch.filesystem.removeSound(name);
    };
    const Buttons = styled.div`
    margin-bottom: 10px;
    `;
    return (
        <div>
            <h2>Sounds</h2>
            <Buttons>
                <AddSoundButton />
                <Button onClick={() => sp.stop()}>
                    <Icon name="stop" />
                    Stop current sound
                </Button>
            </Buttons>
            <SoundTable onPlay={onPlay} onRemove={removeSound} sounds={soundFiles} />
        </div>
    );
};

const SoundRow: React.FC<{
    name: string;
    path: string;
    onPlay: () => void;
    onRemove: () => void;
}> = props => {
    const Clickable = styled.span`
    cursor: pointer;
    `;
    return (
        <Table.Row key={props.path}>
            <Table.Cell>
                {props.name}
            </Table.Cell>
            <Table.Cell>
                {props.path}
            </Table.Cell>
            <Table.Cell>
                <Clickable onClick={props.onPlay}><Icon name="play" /></Clickable>
            </Table.Cell>
            <Table.Cell>
                <Clickable onClick={props.onRemove}><Icon name="trash" /></Clickable>
            </Table.Cell>
        </Table.Row>
    );
};

const SoundTable: React.FC<{
    sounds: { [name: string]: string};
    onPlay: (name: string) => void;
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
