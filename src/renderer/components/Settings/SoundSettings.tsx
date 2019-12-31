import * as React from "react";
import path from "path";

import { useDispatch } from "react-redux";
import { Button, Icon, Table } from "semantic-ui-react";

import { Dispatch } from "@/store";
import { sp } from "@/lib/sounds";
import { getFilePath } from "@/lib/utils";
import styled from "styled-components";
import { shell } from "electron";


export const SoundSettings: React.FC = () => {
    const dispatch = useDispatch<Dispatch>();
    const onPlay = (name: string) => {
        const filePath = sp.getSoundPath(name);
        if (filePath) {
            shell.openItem(filePath);
        }
    };
    const getSounds = async () => {
        const p = await getFilePath({
            filters: [{ name: "Audio files", extensions: ["mp3", "wav"] }],
        }, false);
        if (p) {
            const name = path.basename(p);
            sp.addSound(name, p);
            dispatch.filesystem.setSoundFiles(sp.serialize());
        }
    };
    const removeSound = (name: string) => {
        sp.removeSound(name);
        dispatch.filesystem.setSoundFiles(sp.serialize());
    };
    const Buttons = styled.div`
    margin-bottom: 10px;
    `;
    return (
        <div>
            <h2>Sounds</h2>
            <Buttons>
                <Button onClick={() => getSounds().catch(console.error)}>
                    <Icon name="add" />
                    Add sound
                </Button>
                <Button onClick={() => sp.stop()}>
                    <Icon name="stop" />
                    Stop current sound
                </Button>
            </Buttons>
            <SoundTable onPlay={onPlay} onRemove={removeSound} sounds={sp.sounds} />
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
    };
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
