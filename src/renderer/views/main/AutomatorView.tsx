import React from "react";

import styled from "styled-components";

import { Icon } from "semantic-ui-react";

import { Automator } from "@/containers/Automator/Automator";
import { StatusBar } from "@/containers/Automator/StatusBar";

const Content = styled.div`
    padding: 20px;
`;

const Footer = styled.div`
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
    background-color: ${props => props.theme.background};
    position: sticky;
    left: 0;
    bottom: 0;
    width: 100%;
    padding-left: 20px;
`;

export const AutomatorView: React.FC = () => {
    return (
        <div>
            <Content>
                <h1>Automator <Icon name="bolt" /></h1>
                <Automator />
            </Content>
            <Footer>
                <StatusBar />
            </Footer>
        </div>
    );
};
