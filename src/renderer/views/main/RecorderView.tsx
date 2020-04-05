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

export const RecorderView: React.FC = () => {
    const { dolphinQueue } = useSelector((state: iRootState) => state.tempContainer);
    const dispatch = useDispatch<Dispatch>();
    const [record, setRecord] = React.useState(false);
    const [splitFiles, setSplitFiles] = React.useState(false);
    const loadFileHandler = () => {
        const options = {
            record: true,
            pauseBetweenEntries: true,
        }
        console.log(options);
        loadFileInDolphin(options).catch(console.error);
    }
    console.log(dolphinQueue);
    const droppedFilesHandler = (files: string[]) => {
        dispatch.tempContainer.appendDolphinQueue(files.map(p => ({path: p})));
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
    return (
        <Outer>
            <Content>
                <h1>Game Recorder <Icon name="record" /></h1>
                <MainBody>
                    <DropPad onDrop={(files) => droppedFilesHandler(files)} files={dolphinQueue} />
                    <div>
                        <div>
                            <Checkbox
                                label="Record output in OBS"
                                checked={record}
                                onChange={(_, data) => {
                                    console.log(data.checked);
                                    setRecord(Boolean(data.checked));
                                    console.log("clicked");
                                    console.log(record);
                                }}
                            />
                        </div>
                        <div>
                            <Checkbox
                                label="Record as separate files"
                                checked={splitFiles}
                                onChange={(_, data) => {
                                    console.log(data.checked);
                                    setSplitFiles(Boolean(data.checked));
                                    console.log("clicked");
                                    console.log(splitFiles);
                                }}
                            />
                        </div>
                        <div>
                            <Button type="button" onClick={() => loadFileHandler()}>
                                Load a file into Dolphin
                    </Button>
                        </div>
                    </div>
                </MainBody>
            </Content>
            <Footer>
                <OBSStatusBar />
            </Footer>
        </Outer>
    );
};
