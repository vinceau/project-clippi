import * as React from "react";
import styled from "styled-components";

import { Icon } from "semantic-ui-react";
import { Tooltip } from "react-tippy";

// import { useDispatch, useSelector } from "react-redux";
// import { Dispatch, iRootState } from "@/store";
import { Panel } from "./Panel";
import { SettingsPage } from "./Settings/Settings";
// import { Tooltip } from "./Tooltip";

// import { TwitchConnect } from "./TwitchConnect";

const Header: React.FC<{
    showSettings?: boolean;
    onSettingsButtonClick?: () => void;
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
            <span onClick={() => {
                if (props.onSettingsButtonClick) {
                    props.onSettingsButtonClick();
                }
            }}><Tooltip arrow={true} duration={200} position="bottom" title="Settings"><Icon name="cog" /></Tooltip></span>
        </HeaderContainer>
    );
};

export const Main: React.FC<{}> = () => {
    const [ showSettings, setShowSettings ] = React.useState(false);
    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };
    // const { showSettings } = useSelector((state: iRootState) => state.tempContainer);
    // const dispatch = useDispatch<Dispatch>();
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
    const NavMenu = styled.nav`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    `;
    const NavButton = styled.div`
        width: 100%;
        text-align: center;
        height: 100%;
    `;
    return (
        <Container>
            <Header showSettings={showSettings} onSettingsButtonClick={() => {
                toggleSettings();
            }} />
            <MainSection>
                <SettingsPage onClose={() => setShowSettings(false)} showSettings={showSettings}/>
                <Panel />
            </MainSection>
            <Footer>
<span>
Project Clippi 2019
</span>
            </Footer>
        </Container>
    );
};
