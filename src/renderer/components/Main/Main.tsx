import * as React from 'react';
import styled from 'styled-components';

import { Switch, Route, Link } from 'react-router-dom';

import { TwitchConnect } from '../TwitchConnect/TwitchConnect';
import { SlippiConnect } from '../SlippiConnect/SlippiConnect';
import { SettingsPage } from '../Settings/Settings';

export const Main: React.FC<{}> = () => {
    const Container = styled.div`
        display: flex;
        flex-flow: column;
        height: 100%;
    `;
    const Header = styled.header`
        flex: 0 1 auto;
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
        width: 33.33%;
        text-align: center;
        height: 100%;
    `;
    return (
        <Container>
            <Header>
                <h1>Project Clippi</h1>
            </Header>
            <MainSection>
                <Switch>
                    <Route path="/" exact={true} component={TwitchConnect} />
                    <Route path="/slippi" exact={true} component={SlippiConnect} />
                    <Route path="/settings" exact={true} component={SettingsPage} />
                </Switch>
            </MainSection>
            <Footer>
                <NavMenu>
                    <NavButton>
                        <Link to={`/`}>Home</Link>
                    </NavButton>
                    <NavButton>
                        <Link to={`/slippi`}>Slippi</Link>
                    </NavButton>
                    <NavButton>
                        <Link to={`/settings`}>Settings</Link>
                    </NavButton>
                </NavMenu>
            </Footer>
        </Container>
    );
};
