import * as React from "react";
import styled from "styled-components";

import { Icon } from "semantic-ui-react";

import { LabelledButton } from "./LabelledButton";
import { Panel } from "./Panel";
import { SettingsPage } from "./Settings/Settings";

const Header: React.FC<{
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
            </div>
            <LabelledButton onClick={props.onSettingsButtonClick} title="Settings">
                <Icon name="cog" />
            </LabelledButton>
        </HeaderContainer>
    );
};

export const Main: React.FC<{}> = () => {
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
