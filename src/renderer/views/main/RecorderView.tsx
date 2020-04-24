import React from "react";

import { darken, lighten } from "polished";
import styled from "styled-components";

import { Text } from "@/components/Form";
import { Labelled } from "@/components/Labelled";
import { Dispatch, iRootState } from "@/store";
import { ThemeMode, useTheme } from "@/styles";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon } from "semantic-ui-react";

import { DropPad } from "@/components/DropPad";
import { OBSStatusBar } from "@/containers/Recorder/OBSStatusBar";
import { saveQueueToFile } from "@/lib/dolphin";

const Content = styled.div`
    display: flex;
    flex-direction: column;
    padding: 2rem;
    height: calc(100% - 5.6rem);
    overflow: hidden;
    overflow-y: auto;
`;

const Footer = styled.div`
    display: flex;
    border-top: solid 0.1rem ${({ theme }) => theme.background3};
    background-color: ${props => props.theme.background};
    height: 5.5rem;
    padding: 0 2rem;
`;

const Outer = styled.div`
display: flex;
height: 100%;
overflow: hidden;
flex-direction: column;
`;

const MainBody = styled.div<{
    themeName: string;
}>`
flex-grow: 1;
background-color: ${p => {
        const adjust = p.themeName === ThemeMode.DARK ? lighten : darken;
        return adjust(0.05, p.theme.background);
    }};
border-radius: 0.5rem;
overflow: hidden;
overflow-y: auto;
position: relative;
`;

const Toolbar = styled.div`
padding-top: 2rem;
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
margin-bottom: 1rem;
`;

export const RecorderView: React.FC = () => {
    const theme = useTheme();
    const { dolphinQueue } = useSelector((state: iRootState) => state.tempContainer);
    const dispatch = useDispatch<Dispatch>();
    const onRemove = (index: number) => {
        dispatch.tempContainer.removeDolphinQueueEntry(index);
    };
    const loadFileHandler = () => {
        dispatch.tempContainer.loadDolphinQueue();
    };
    const droppedFilesHandler = (files: string[]) => {
        dispatch.tempContainer.appendDolphinQueue(files.map(p => ({ path: p })));
        // const filepaths = files.map(f => f.path);
        // setFiles(filepaths)
        /*
        const options = {
            record: true,
            pauseBetweenEntries: false,
        }
        console.log(options);
        loadSlpFilesInDolphin(filepaths, options).catch(console.error);
        */
    };
    const addFileHandler = () => {
        dispatch.tempContainer.addFileToDolphinQueue();
    };
    const shuffleQueueHandler = () => {
        dispatch.tempContainer.shuffleDolphinQueue();
    };
    const clearQueueHandler = () => {
        dispatch.tempContainer.resetDolphinQueue();
    };
    const onSaveHandler = () => {
        saveQueueToFile().catch(console.error);
    };
    const onDragEnd = (result: any) => {
        const { destination, source } = result;
        if (!destination) {
            return;
        }
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }
        dispatch.tempContainer.moveDolphinQueueEntry({
            startIndex: source.index,
            endIndex: destination.index,
        });
    };
    const validQueue = dolphinQueue.length > 0;
    return (
        <Outer>
            <Content>
                <h1>Playback Queue <Icon name="list" /></h1>
                <Text margin="none">Create a playlist of replays and load them into Dolphin</Text>
                <Toolbar>
                    <div>
                        <Button type="button" onClick={loadFileHandler}>
                            <Icon name="folder" /> Load JSON
                        </Button>
                        <Button type="button" disabled={!validQueue} onClick={onSaveHandler}>
                            <Icon name="save" /> Save JSON
                        </Button>
                    </div>
                    {validQueue && <div>
                        <Labelled title="Add file"><Button onClick={addFileHandler} icon="plus" /></Labelled>
                        <Labelled title="Shuffle queue"><Button onClick={shuffleQueueHandler} icon="shuffle" /></Labelled>
                        <Labelled title="Clear queue"><Button onClick={clearQueueHandler} icon="trash" /></Labelled>
                    </div>}
                </Toolbar>
                <MainBody themeName={theme.themeName}>
                    <DropPad
                        id="recorder-drop-pad"
                        onDragEnd={onDragEnd}
                        onDrop={(files) => droppedFilesHandler(files)} files={dolphinQueue}
                        onRemove={onRemove}
                    />
                </MainBody>
            </Content>
            <Footer>
                <OBSStatusBar />
            </Footer>
        </Outer>
    );
};
