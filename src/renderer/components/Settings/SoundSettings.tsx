import * as React from "react";
import path from "path";

import { useDispatch, useSelector } from "react-redux";
import { Button, Icon, Table } from "semantic-ui-react";

import { Dispatch, iRootState } from "@/store";
import { sp } from "@/lib/sounds";
import { getFilePath } from "@/lib/utils";


export const SoundSettings: React.FC = () => {
    const soundFiles = useSelector((state: iRootState) => state.filesystem.soundFiles);
    const sounds = sp.deserialize(soundFiles);
    const dispatch = useDispatch<Dispatch>();
    const onPlay = (name: string) => {
        sp.playSound(name).catch(console.error);
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
    return (
        <div>
            <h1>Sound Settings</h1>
            <Button onClick={() => getSounds().catch(console.error)}>
                <Icon name="add" />
                Add sounds
            </Button>
            <SoundTable onPlay={onPlay} onStop={() => sp.stop()} onRemove={removeSound} sounds={sounds}/>
        </div>
    );
};

const SoundTable: React.FC<{
    sounds: Map<string, string>;
    onPlay: (name: string) => void;
    onStop: () => void;
    onRemove: (name: string) => void;
}> = props => {
    const [playing, setPlaying] = React.useState<string | null>(null);
    const rows: JSX.Element[] = [];
    const onPlay = (name: string) => {
        setPlaying(name);
        props.onPlay(name);
    };
    const onStop = () => {
        setPlaying(null);
        props.onStop();
    };
    const onRemove = (name: string) => {
        if (playing === name) {
            onStop();
        }
        props.onRemove(name);
    };
    props.sounds.forEach((value, key) => {
        rows.push((
      <Table.Row key={`${value}--${key}`}>
        <Table.Cell>
            {key}
        </Table.Cell>
        <Table.Cell>
          {value}
        </Table.Cell>
        <Table.Cell>
            {playing === key ?
            <span onClick={() => onStop()}><Icon name="stop" /></span>
            :
            <span onClick={() => onPlay(key)}><Icon name="play"/></span>
    }
        </Table.Cell>
        <Table.Cell>
            <span onClick={() => onRemove(key)}><Icon name="remove"/></span>
        </Table.Cell>
      </Table.Row>
        ));
    });
    return (
        <div>
 <Table celled padded>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell singleLine>Name</Table.HeaderCell>
        <Table.HeaderCell>File Path</Table.HeaderCell>
        <Table.HeaderCell>Play</Table.HeaderCell>
        <Table.HeaderCell>Delete</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
        {rows}
    </Table.Body>
  </Table>
        </div>
    );
};
