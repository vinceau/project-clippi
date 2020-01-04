import * as React from "react";

import {
    Route,
    Switch,
    useHistory,
    useRouteMatch,
} from "react-router-dom";

import { Icon, Menu } from "semantic-ui-react";
import styled, { css } from "styled-components";

import { device } from "@/styles/device";
import OBSLogo from "@/styles/images/obs.svg";
import SlippiLogo from "@/styles/images/slippi-logo.svg";
import { CustomIcon, Labelled } from "../Misc/Misc";
import { ComboFinder } from "./ComboFinder";
import { FilterOptions } from "./FilterOptions";
import { OBSSettings } from "./OBSSettings";
import { SlippiPage } from "./SlippiPage";
import { SoundSettings } from "./SoundSettings";
import { TwitchIntegration } from "./TwitchIntegration";

export const SettingsPage: React.FC<{
    showSettings: boolean;
    onClose: () => void;
}> = props => {
    const { path } = useRouteMatch();
    const history = useHistory();
    const [activeItem, setActiveItem] = React.useState("bio");

    const handleItemClick = (_: any, { name }: any) => {
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
    const Wrapper = styled.div`
    display: flex;
    `;
    const MenuColumn = styled.div`
    flex-basis: 100%;
    overflow: hidden;
    overflow-y: auto;
    height: 100vh;
    background-color: #F9FAFB;
    border-right: solid 1px #d4d4d5;
    @media ${device.mobileL} {
        flex-basis: 30%;
    }
    @media ${device.tablet} {
        flex-basis: 25%;
    }
    `;
    const ContentColumn = styled.div`
    flex-basis: 0%;
    overflow: hidden;
    overflow-y: auto;
    height: 100vh;
    padding-left: 25px;
    @media ${device.mobileL} {
        flex-basis: 70%;
    }
    @media ${device.tablet} {
        flex-basis: 75%;
    }
    & > div {
        padding-top: 50px;
        padding-right: 100px;
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
        @media ${device.mobileL} {
            padding-top: 20px;
            padding-left: 10px;
            padding-right: 10px;
        }
    }
    `;
    const CloseButton = styled.div`
        font-size: 25px;
        position: fixed;
        top: 20px;
        right: 40px;
    `;
    return (
        <SettingsContainer>
            <CloseButton>
                <Labelled onClick={props.onClose} title="Close">
                    <Icon name="close" />
                </Labelled>
            </CloseButton>
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
                        <Menu.Item header>Automation Settings</Menu.Item>
                        <Menu.Item
                            name="slippi-settings"
                            active={activeItem === "slippi-settings"}
                            onClick={handleItemClick}
                        ><CustomIcon image={SlippiLogo} color="#353636" />Slippi Relay</Menu.Item>
                        <Menu.Item
                            name="obs-settings"
                            active={activeItem === "obs-settings"}
                            onClick={handleItemClick}
                        ><CustomIcon image={OBSLogo} color="#353636" />OBS Configuration</Menu.Item>
                        <Menu.Item
                            name="account-settings"
                            active={activeItem === "account-settings"}
                            onClick={handleItemClick}
                        ><Icon name="twitch" />Twitch Integration</Menu.Item>
                        <Menu.Item
                            name="sound-settings"
                            active={activeItem === "sound-settings"}
                            onClick={handleItemClick}
                        ><Icon name="volume down" />Sounds</Menu.Item>
                    </StyledMenu>
                </MenuColumn>
                <ContentColumn>
                    <div>
                        <Switch>
                            <Route path={`${path}/obs-settings`} component={OBSSettings} />
                            <Route path={`${path}/slippi-settings`} component={SlippiPage} />
                            <Route path={`${path}/combo-finder`} component={ComboFinder} />
                            <Route path={`${path}/combo-settings`} component={FilterOptions} />
                            <Route path={`${path}/account-settings`} component={TwitchIntegration} />
                            <Route path={`${path}/sound-settings`} component={SoundSettings} />
                        </Switch>
                    </div>
                </ContentColumn>
            </Wrapper>
        </SettingsContainer>
    );
};
