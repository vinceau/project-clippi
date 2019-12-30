import * as React from "react";

import {
    Link as LinkContainer,
    Redirect,
    Route,
    Switch,
    useRouteMatch,
    useHistory,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { Dispatch, iRootState } from "@/store";

import { comboFilter } from "@/lib/realtime";
import { ComboFilterSettings } from "@vinceau/slp-realtime";
import styled, { css } from "styled-components";
import { ComboFinder } from "./ComboFinder";
import { ComboForm } from "./ComboForm";

import { Container, Icon, Grid, Menu, Button } from "semantic-ui-react";
import { device } from "@/styles/device";

export const SettingsPage: React.FC<{
    showSettings: boolean;
    onClose: () => void;
}> = props => {
    const { path } = useRouteMatch();
    const history = useHistory();
    const [activeItem, setActiveItem] = React.useState("bio");

    const handleItemClick = (e: any, { name }: any) => {
        history.push(`${path}/${name}`);
        setActiveItem(name);
    };
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
        ${!props.showSettings && hiddenSettings}
    `;
    const StyledGrid = styled(Grid)`
    margin-left: 0 !important;
    margin-right: 0 !important;
    `;
    const Wrapper = styled.div`
    display: flex;
    `;
    const MenuColumn = styled.div`
    flex-basis: 100%;
    overflow: hidden;
    overflow-y: auto;
    height: 100vh;
    @media ${device.tablet} {
        flex-basis: 30%;
    }
    `;
    const ContentColumn = styled.div`
    flex-basis: 0%;
    overflow: hidden;
    overflow-y: auto;
    height: 100vh;
    @media ${device.tablet} {
        flex-basis: 70%;
    }
    `;
    const StyledMenu = styled(Menu)`
    &&& {
        width: 100%;
        padding: 50px;
        a.item {
            & > i.icon {
                float: left;
                margin-right: 10px;
                margin-left: 0;
            }
        }
        @media ${device.tablet} {
            padding-top: 20px;
            padding-left: 10px;
            padding-right: 10px;
        }
    }
    `;
    return (
        <SettingsContainer>
            <Wrapper>
                <MenuColumn>
                <StyledMenu secondary={true} vertical={true}>
                    <Menu.Item header>Combo Settings</Menu.Item>
                        <Menu.Item
                            name="combo-finder"
                            active={activeItem === "combo-finder"}
                            onClick={handleItemClick}
                        ><Icon name="search" /> Combo Finder</Menu.Item>
                        <Menu.Item
                            name="combo-settings"
                            active={activeItem === "combo-settings"}
                            onClick={handleItemClick}
                        ><Icon name="filter" />Filter Options</Menu.Item>
                    <Menu.Item header>Account Settings</Menu.Item>
                        <Menu.Item
                            name="account-settings"
                            active={activeItem === "account-settings"}
                            onClick={handleItemClick}
                        ><Icon name="twitch" />Twitch Integration</Menu.Item>
                    </StyledMenu>
                </MenuColumn>
                <ContentColumn>
                    <Switch>
                        <Route path={`${path}/combo-finder`} component={PageSettingsProfile} />
                        <Route path={`${path}/combo-settings`} component={PageSettingsBilling} />
                        <Route path={`${path}/account-settings`} component={PageSettingsAccount} />
                    </Switch>
                </ContentColumn>
            </Wrapper>
        </SettingsContainer>
    );

    /*
    return (
        <SettingsContainer>
        <Container>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <h1>Settings</h1>
                <Button onClick={() => props.onClose()}><Icon name="close"/> Close</Button>
            </div>
        <StyledGrid>
            <Grid.Column width={4}>
                <Menu fluid vertical tabular>
                    <Menu.Item
                        name="combo-finder"
                        active={activeItem === "combo-finder"}
                        onClick={handleItemClick}
                    >Combo Finder</Menu.Item>
                    <Menu.Item
                        name="combo-settings"
                        active={activeItem === "combo-settings"}
                        onClick={handleItemClick}
                    />
                    <Menu.Item
                        name="account-settings"
                        active={activeItem === "account-settings"}
                        onClick={handleItemClick}
                    />
                </Menu>
            </Grid.Column>

            <Grid.Column stretched width={12}>
                    <Switch>
                        <Route path={`${path}/combo-finder`} component={PageSettingsProfile} />
                        <Route path={`${path}/combo-settings`} component={PageSettingsBilling} />
                        <Route path={`${path}/account-settings`} component={PageSettingsAccount} />
                    </Switch>
            </Grid.Column>
        </StyledGrid>
</Container>
</SettingsContainer>
    );
    */
};

/*
export const OldSettingsPage: React.FC<{
    showSettings: boolean;
}> = props => {
    return (
        <SettingsContainer>
            <h2>Settings</h2>

            <div style={{ display: "flex" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <LinkContainer to={`${path}/profile`}>
                        ComboFinder
            </LinkContainer>
                    <LinkContainer to={`${path}/billing`}>
                        Combo Settings
            </LinkContainer>
                    <LinkContainer to={`${path}/account`}>
                        Account
            </LinkContainer>
                </div>

                <div>
                    <Switch>
                        <Route path={`${path}/profile`} component={PageSettingsProfile} />
                        <Route path={`${path}/billing`} component={PageSettingsBilling} />
                        <Route path={`${path}/account`} component={PageSettingsAccount} />
                    </Switch>
                </div>
            </div>
        </SettingsContainer>
    );
};
*/

const PageSettingsProfile = () => {
    return (
        <div><ComboFinder /></div>
    );
};


export const PageSettingsBilling = () => {
    const settings = useSelector((state: iRootState) => state.slippi.settings);
    const initial = comboFilter.updateSettings(JSON.parse(settings));
    const dispatch = useDispatch<Dispatch>();
    const onSubmit = (values: Partial<ComboFilterSettings>) => {
        const newValues = comboFilter.updateSettings(values);
        console.log(`updated combo filter with new values: ${newValues}`);
        const valueString = JSON.stringify(newValues);
        console.log(`updating redux store: ${valueString}`);
        dispatch.slippi.updateSettings(valueString);
    };
    return (
        <div>
            <ComboForm initialValues={initial} onSubmit={onSubmit} />
        </div>
    );
};

const PageSettingsAccount = () => {
    return (
        <div>Accounts</div>
    );
};
