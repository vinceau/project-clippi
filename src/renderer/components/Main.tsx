import * as React from "react";
import styled from "styled-components";

import { Container, Icon } from "semantic-ui-react";

import { LabelledButton } from "./LabelledButton";
import { Panel } from "./Panel";
import { SettingsPage } from "./Settings/Settings";
import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { ConnectionStatusDisplay } from "./ConnectionStatus";
import { slippiLivestream } from "@/lib/realtime";

const Header: React.FC<{
    showSettings?: boolean;
    onSettingsButtonClick: () => void;
}> = (props) => {
    const { port } = useSelector((state: iRootState) => state.slippi);
    const { slippiConnectionStatus } = useSelector((state: iRootState) => state.tempContainer);
    const dispatch = useDispatch<Dispatch>();

    const HeaderContainer = styled.header`
        flex: 0 1 auto;
        background-color: #F9FAFB;
        border-bottom: 1px solid #d4d4d5;
    `;
    const Inner = styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    return (
        <HeaderContainer>
            <Container>
                <Inner>
                    <div>
                        <ConnectionStatusDisplay
                            status={slippiConnectionStatus}
                            port={port}
                            onConnectClick={() => dispatch.slippi.connectToSlippi(port)}
                            onDisconnectClick={() => slippiLivestream.connection.disconnect() }
                            onPortChange={dispatch.slippi.setPort}
                        />
                    </div>
                    <LabelledButton onClick={props.onSettingsButtonClick} title="Settings">
                        <Icon name="cog" size="big" />
                    </LabelledButton>
                </Inner>
            </Container>
        </HeaderContainer>
    );
};

export const Main: React.FC<{}> = () => {
    // const { slippiConnectionStatus } = useSelector((state: iRootState) => state.tempContainer);
    // const dispatch = useDispatch<Dispatch>();

    const [showSettings, setShowSettings] = React.useState(false);
    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };
    const Container = styled.div`
        display: flex;
        flex-flow: column;
        height: 100%;
    `;
    const MainSection = styled.main`
        display: flex;
        flex-flow: column;
        flex: 1 1 auto;
        overflow-y: auto;
    `;
    const Footer = styled.footer`
        flex: 0 1 40px;
    `;
    return (
        <Container>
            <Header showSettings={showSettings} onSettingsButtonClick={() => {
                toggleSettings();
            }} />
            <MainSection>
                <SettingsPage onClose={() => setShowSettings(false)} showSettings={showSettings} />
                <Panel />
            </MainSection>
            <Footer>
                <span>Project Clippi 2019</span>
            </Footer>
        </Container>
    );
};
