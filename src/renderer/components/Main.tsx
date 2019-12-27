import * as React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


// import { useDispatch, useSelector } from "react-redux";
// import { Dispatch, iRootState } from "@/store";
import { Link, Route, Switch } from "react-router-dom";
import { Panel } from "./Panel";
import { SettingsPage } from "./Settings/Settings";

// import { TwitchConnect } from "./TwitchConnect";

const Header: React.FC<{
    showSettings?: boolean;
    onSettingsButtonClick?: () => void;
}> = (props) => {
    const HeaderContainer = styled.header`
        flex: 0 1 auto;
        display: flex;
        justify-content: space-between;
    `;
    return (
        <HeaderContainer>
            <div>
                <h1>Project Clippi</h1>
            </div>
            <div onClick={() => {
                if (props.onSettingsButtonClick) {
                    props.onSettingsButtonClick();
                }
            }}><FontAwesomeIcon icon="cog" /></div>
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
                <SettingsPage showSettings={showSettings}/>
                <Switch>
                    <Route path="/" exact={true} component={Panel} />
                    {/* <Route path="/settings" exact={true} component={SettingsPage} /> */}
                </Switch>
            </MainSection>
            <Footer>
                <NavMenu>
                    <NavButton>
                        <Link to={`/`}>Home</Link>
                    </NavButton>
                </NavMenu>
                <NavButton>
                    <Link to={`/settings`}>Settings</Link>
                </NavButton>
            </Footer>
        </Container>
    );
};
