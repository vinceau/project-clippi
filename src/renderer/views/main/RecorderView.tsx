import React from "react";

import styled from "styled-components";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch, iRootState } from "@/store";
import { Header, Segment, Button, Checkbox, Icon } from "semantic-ui-react";
import { loadFileInDolphin } from "@/lib/utils";

import { OBSStatusBar } from "@/containers/Recorder/OBSStatusBar";
import { DropPad } from "@/components/DropPad";
import { loadSlpFilesInDolphin } from "@/lib/dolphin";

const Content = styled.div`
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

const MainBody = styled.div`
display: flex;
flex-direction: row;
`;

const Toolbar = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
margin-bottom: 10px;
`;

export const RecorderView: React.FC = () => {
    const { dolphinQueue } = useSelector((state: iRootState) => state.tempContainer);
    const dispatch = useDispatch<Dispatch>();
    const loadFileHandler = () => {
        dispatch.tempContainer.loadDolphinQueue();
    }
    console.log(dolphinQueue);
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
    }
    const clearQueueHandler = () => {
        dispatch.tempContainer.resetDolphinQueue();
    }
    const validQueue = dolphinQueue.length > 0;
    return (
        <Outer>
            <Content>
                <h1>Game Recorder <Icon name="record" /></h1>
                <Toolbar>
                    <div>
                        <Button type="button" onClick={() => loadFileHandler()}>
                            <Icon name="folder" /> Load JSON
                        </Button>
                        <Button type="button" disabled={!validQueue}>
                            <Icon name="save" /> Save JSON
                        </Button>
                    </div>
                    <Button onClick={clearQueueHandler}><Icon name="trash" disabled={!validQueue} /> Clear queue</Button>
                </Toolbar>
                <MainBody>
                    <DropPad onDrop={(files) => droppedFilesHandler(files)} files={dolphinQueue} />
                </MainBody>
            </Content>
            <Footer>
                <OBSStatusBar />
            </Footer>
        </Outer>
    );
};
