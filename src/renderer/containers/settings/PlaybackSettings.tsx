import React from "react";

import { FileInput } from "@/components/FileInput";

import { Field, FormContainer, Label, PageHeader, Text } from "@/components/Form";
import { getDolphinExecutableName } from "@/lib/dolphin";
import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

export const PlaybackSettings: React.FC = () => {
    const dispatch = useDispatch<Dispatch>();
    const { meleeIsoPath, dolphinPath } = useSelector((state: iRootState) => state.filesystem);
    const setMeleeIsoPath = (filePath: string) => dispatch.filesystem.setMeleeIsoPath(filePath);
    const setDolphinPath = (filePath: string) => dispatch.filesystem.setDolphinPath(filePath);
    return (
        <FormContainer>
            <PageHeader>Playback</PageHeader>
            <Field padding="bottom">
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
                <Text>The folder containing the <b>{getDolphinExecutableName()}</b> playback executable. Only modify this if you really know what you're doing or if you're using a Linux machine.</Text>
            </Field>
        </FormContainer>
    );
};
