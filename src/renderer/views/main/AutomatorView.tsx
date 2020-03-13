import React from "react";

import styled from "styled-components";

import { Icon } from "semantic-ui-react";

import { Automator } from "@/containers/Automator/Automator";
import { StatusBar } from "@/containers/Automator/StatusBar";

const Content = styled.div`
    padding: 20px;
    margin-bottom: 55px;
`;

const Footer = styled.div`
    border-top: solid 1px ${({theme}) => theme.background3};
    background-color: ${props => props.theme.background};
    position: fixed;
    bottom: 0;
    height: 55px;
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
