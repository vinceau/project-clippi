import React from "react";

import styled from "styled-components";

import { Icon } from "semantic-ui-react";

import { FormContainer } from "@/components/Form";
import { Automator } from "@/containers/Automator/Automator";
import { StatusBar } from "@/containers/Automator/StatusBar";

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

export const AutomatorView: React.FC = () => {
    return (
        <Outer>
            <Content>
                <FormContainer>
                    <h1>Automator <Icon name="bolt" /></h1>
                    <Automator />
                </FormContainer>
            </Content>
            <Footer>
                <StatusBar />
            </Footer>
        </Outer>
    );
};
