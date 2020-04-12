import React from "react";

import styled from "styled-components";

import { Icon } from "semantic-ui-react";

import { ProcessorStatusBar } from "@/containers/processor/ProcessorStatusBar";
import { ProgressBar } from "@/containers/processor/ProgressBar";
import { ComboFinder } from "@/containers/Settings/ComboFinder";

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
    position: relative;
    display: flex;
`;

const Outer = styled.div`
display: flex;
height: 100%;
overflow: hidden;
flex-direction: column;
`;

export const ReplayProcessorView: React.FC = () => {
    return (
        <Outer>
            <Content>
                <h1>Replay Processor <Icon name="fast forward" /></h1>
                <ComboFinder />
            </Content>
            <Footer>
                <ProcessorStatusBar />
                <ProgressBar />
            </Footer>
        </Outer>
    );
};
