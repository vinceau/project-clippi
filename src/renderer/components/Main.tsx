import * as React from "react";
import styled from "styled-components";

import { Link, Route, Switch } from "react-router-dom";
import { Panel } from "./Panel";

// import { TwitchConnect } from "./TwitchConnect";

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
        width: 100%;
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
                    <Route path="/" exact={true} component={Panel} />
                </Switch>
            </MainSection>
            <Footer>
                <NavMenu>
                    <NavButton>
                        <Link to={`/`}>Home</Link>
                    </NavButton>
                </NavMenu>
            </Footer>
        </Container>
    );
};
