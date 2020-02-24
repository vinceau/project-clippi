
import * as React from "react";

import {
    useHistory,
    useRouteMatch,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

import { Automator } from "@/containers/Automator/Automator";
import { ComboFinder } from "@/containers/Settings/ComboFinder";
import { device } from "@/styles/device";
import { Menu } from "@/views/main/Menu";
import { Icon } from "semantic-ui-react";
import styled, { css } from "styled-components";

export const MainView: React.FC = props => {
    const match = useRouteMatch();
    const SettingsContainer = styled.div`
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        overflow: auto;
    `;
    const MenuColumn = styled.div`
    width: 70px;
    overflow: hidden;
    overflow-y: auto;
    height: 100vh;
    background-color: ${({ theme }) => theme.background2};
    border-right: solid 1px ${({ theme }) => theme.background3};
    `;
    const ContentColumn = styled.div`
    width: calc(100% - 70px);
    overflow: hidden;
    overflow-y: auto;
    height: 100vh;
    color: ${({ theme }) => theme.foreground};
    background: ${({ theme }) => theme.background};
    `;
    return (
        <SettingsContainer>
            <div style={{ display: "flex" }}>
                <MenuColumn>
                    <Menu />
                </MenuColumn>
                <ContentColumn>
                    <Switch>
                        <Route path={`${match.path}/automator`}>
                            <Automator />
                        </Route>
                        <Route path={`${match.path}/processor`}>
                            <ComboFinder />
                        </Route>
                        <Route path={`${match.path}/streamer`}>
                            <div>Streamer</div>
                        </Route>
                    </Switch>
                </ContentColumn>
            </div>
        </SettingsContainer>
    );
};
