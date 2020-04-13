import React from "react";

import styled from "styled-components";
import { lighten, darken } from "polished";

import { ThemeMode, useTheme } from "@/styles";
import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon } from "semantic-ui-react";

import { DropPad } from "@/components/DropPad";
import { OBSStatusBar } from "@/containers/Recorder/OBSStatusBar";
import { saveQueueToFile } from "@/lib/dolphin";

const Content = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    height: calc(100% - 56px);
    overflow: hidden;
    overflow-y: auto;
`;

const Footer = styled.div`
    border-top: solid 1px ${({ theme }) => theme.background3};
    background-color: ${props => props.theme.background};
    height: 55px;
    padding: 0 20px;
`;

const Outer = styled.div`
display: flex;
height: 100%;
overflow: hidden;
flex-direction: column;
`;

const MainBody = styled.div<{
    themeName: ThemeMode;
}>`
flex-grow: 1;
background-color: ${p => {
    const adjust = p.themeName === ThemeMode.DARK ? lighten : darken;
    return adjust(0.05, p.theme.background);
}};
border-radius: 5px;
overflow: hidden;
overflow-y: auto;
position: relative;
`;

const Toolbar = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
margin-bottom: 10px;
`;

export const RecorderView: React.FC = () => {
    const theme = useTheme();
    const { dolphinQueue } = useSelector((state: iRootState) => state.tempContainer);
    const dispatch = useDispatch<Dispatch>();
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
    const clearQueueHandler = () => {
        dispatch.tempContainer.resetDolphinQueue();
    };
    const onSaveHandler = () => {
        saveQueueToFile().catch(console.error);
    };
    const validQueue = dolphinQueue.length > 0;
    return (
        <Outer>
            <Content>
                <h1>Game Recorder <Icon name="record" /></h1>
                <Toolbar>
                    <div>
                        <Button type="button" onClick={loadFileHandler}>
                            <Icon name="folder" /> Load JSON
                        </Button>
                        <Button type="button" disabled={!validQueue} onClick={onSaveHandler}>
                            <Icon name="save" /> Save JSON
                        </Button>
                    </div>
                    <Button onClick={clearQueueHandler} disabled={!validQueue}><Icon name="trash" /> Clear queue</Button>
                </Toolbar>
                <MainBody themeName={theme.themeName}>
                    <DropPad onDrop={(files) => droppedFilesHandler(files)} files={dolphinQueue} />
                </MainBody>
            </Content>
            <Footer>
                <OBSStatusBar />
            </Footer>
        </Outer>
    );
};
