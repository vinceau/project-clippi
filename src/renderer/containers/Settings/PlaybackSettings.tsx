import React from "react";

import { FileInput } from "@/components/FileInput";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch, iRootState } from "@/store";
import styled from "styled-components";
import { Label, Field, Text, PageHeader } from "@/components/Form";
import { getDolphinExecutableName } from "@/lib/dolphin";

const Outer = styled.div`
max-width: 800px;
`;

export const PlaybackSettings: React.FC = () => {
    const dispatch = useDispatch<Dispatch>();
    const { meleeIsoPath, dolphinPath } = useSelector((state: iRootState) => state.filesystem);
    const setMeleeIsoPath = (filePath: string) => dispatch.filesystem.setMeleeIsoPath(filePath);
    const setDolphinPath = (filePath: string) => dispatch.filesystem.setDolphinPath(filePath);
    return (
        <Outer>
            <PageHeader>Playback</PageHeader>
            <Field>
                <Label>Melee ISO File</Label>
                <FileInput
                    value={meleeIsoPath}
                    onChange={setMeleeIsoPath}
                />
                <Text>The path to an NTSC Melee 1.02 ISO. Dolphin will auto-launch this title when playing back replays.</Text>
            </Field>
            <Field border="top">
                <Label>Playback Dolphin Path</Label>
                <FileInput
                    value={dolphinPath}
                    directory={true}
                    onChange={setDolphinPath}
                />
                <Text>The folder containing the <b>{getDolphinExecutableName()}</b> playback executable. You should only need to set this on Linux machines, or if you really know what you're doing.</Text>
            </Field>
        </Outer>
    );
};
