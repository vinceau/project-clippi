
import * as React from "react";

import {
    useHistory,
    useRouteMatch,
} from "react-router-dom";

import { device } from "@/styles/device";
import { Menu } from "@/components/layout/Menu";
import { Icon } from "semantic-ui-react";
import styled, { css } from "styled-components";

export const MainView: React.FC = props => {
    const { path } = useRouteMatch();
    const history = useHistory();
    const hiddenSettings = css`
    visibility: hidden;
    overflow: hidden;
    height: 0;
    `;
    const SettingsContainer = styled.div`
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        visibility: visible;
        overflow: auto;
        background-color: rgba(255, 255, 255, 1);
        z-index: 1;
    `;
    const MenuColumn = styled.div`
    width: 70px;
    overflow: hidden;
    overflow-y: auto;
    height: 100vh;
    background-color: ${({ theme }) => theme.background2};
    border-right: solid 1px ${({ theme }) => theme.secondary};
    `;
    const ContentColumn = styled.div`
    width: calc(100% - 70px);
    overflow: hidden;
    overflow-y: auto;
    height: 100vh;
    background: ${({ theme }) => theme.background};
    `;
    return (
        <SettingsContainer>
            <div style={{display: "flex"}}>
                <MenuColumn>
                    <Menu />
                </MenuColumn>
                <ContentColumn>
                    <div style={{ height: "1500px", display: "block"}}>
                        second column
                    </div>
                </ContentColumn>
            </div>
        </SettingsContainer>
    );
};
