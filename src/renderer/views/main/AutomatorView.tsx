import React from "react";

import styled from "styled-components";

import { Icon } from "semantic-ui-react";
import { StatusBar } from "@/containers/Automator/StatusBar";
import { Automator } from "@/containers/Automator/Automator";

const Content = styled.div`
    padding: 20px;
`;

const Footer = styled.div`
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    background-color: ${props => props.theme.background};
    position: sticky;
    left: 0;
    bottom: 0;
    width: 100%;
    padding-left: 10px;
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
