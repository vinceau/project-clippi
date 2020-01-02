import * as React from "react";
import styled from "styled-components";

import { Icon } from "semantic-ui-react";

import { LabelledButton } from "./LabelledButton";
import { Panel } from "./Panel";
import { SettingsPage } from "./Settings/Settings";
    import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { ConnectionStatusDisplay } from "./ConnectionStatus";

const Header: React.FC<{
    connectionStatus: any;
    showSettings?: boolean;
    onSettingsButtonClick: () => void;
}> = (props) => {
    const HeaderContainer = styled.header`
        flex: 0 1 auto;
        display: flex;
        justify-content: space-between;
        padding: 20px;
    `;
    return (
        <HeaderContainer>
            <div>
                <span>Project Clippi</span>
                <ConnectionStatusDisplay status={props.connectionStatus} />
            </div>
            <LabelledButton onClick={props.onSettingsButtonClick} title="Settings">
                <Icon name="cog" />
            </LabelledButton>
        </HeaderContainer>
    );
};

export const Main: React.FC<{}> = () => {
    const { slippiConnectionStatus } = useSelector((state: iRootState) => state.tempContainer);
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
            <Header showSettings={showSettings} connectionStatus={slippiConnectionStatus} onSettingsButtonClick={() => {
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
