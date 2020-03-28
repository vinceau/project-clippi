import React from "react";

import styled from "styled-components";

import { Header, Segment, Button, Checkbox, Icon } from "semantic-ui-react";
import { loadFileInDolphin } from "@/lib/utils";

import { OBSStatusBar } from "@/containers/Recorder/OBSStatusBar";
import { DropPad } from "@/components/DropPad";

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
    padding-left: 20px;
`;

const Outer = styled.div`
display: flex;
height: 100%;
overflow: hidden;
flex-direction: column;
`;

export const RecorderView: React.FC = () => {
    const [record, setRecord] = React.useState(false);
    return (
        <Outer>
            <Content>
                <h1>Game Recorder <Icon name="record" /></h1>
                <DropPad onFiles={(files) => console.log(files)} />
                <div>
                    <Checkbox
                        label="Record output in OBS"
                        checked={record}
                        onChange={(_, data) => {
                            console.log("clicked");
                            setRecord(Boolean(data.checked));
                        }}
                    />
                </div>
                <div>
                    <Button type="button" onClick={() => loadFileInDolphin(record).catch(console.error)}>
                        Load a file into Dolphin
                    </Button>
                </div>
            </Content>
            <Footer>
                <OBSStatusBar />
            </Footer>
        </Outer>
    );
};
