import React from "react";

import styled from "styled-components";

import { Icon } from "semantic-ui-react";

import { ComboFinder } from "@/containers/Settings/ComboFinder";

const Content = styled.div`
    padding: 20px;
`;

export const ReplayProcessorView: React.FC = () => {
    return (
        <Content>
            <h1>Replay Processor <Icon name="fast forward" /></h1>
            <ComboFinder />
        </Content>
    );
};
