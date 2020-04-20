import React from "react";

import { Form } from "semantic-ui-react";

import { FileInput } from "@/components/FileInput";

import styled from "styled-components";
import { Label, Text, PageHeader } from "@/components/Form";

const Outer = styled.div`
max-width: 800px;
`;

export const PlaybackSettings: React.FC = () => {
    const [meleeIsoPath, setMeleeIsoPath] = React.useState("");
    const [dolphinPath, setDolphinPath] = React.useState("");
    return (
        <Outer>
            <PageHeader>Playback</PageHeader>
            <Form>
                <Form.Field>
                    <Label>Melee ISO File</Label>
                    <FileInput
                        value={meleeIsoPath}
                        onChange={setMeleeIsoPath}
                    />
                    <Text>The path to an NTSC Melee 1.02 ISO. Dolphin will auto-launch this title when playing back replays.</Text>
                </Form.Field>
                <Form.Field>
                    <Label>Playback Dolphin Path</Label>
                    <FileInput
                        value={dolphinPath}
                        onChange={setDolphinPath}
                    />
                    <Text>The path to the Dolphin playback executable. You should only need to set this on Linux machines, or if you really know what you're doing.</Text>
                </Form.Field>
            </Form>
            <p>{meleeIsoPath}</p>
        </Outer>
    );
};
