import * as React from "react";

import { transparentize } from "polished";
import {
    Redirect,
    Route,
    Switch,
    useHistory,
    useRouteMatch,
} from "react-router-dom";
import { Icon, Menu } from "semantic-ui-react";
import styled, { css } from "styled-components";

import { CustomIcon } from "@/components/CustomIcon";
import { Labelled } from "@/components/Labelled";
import { device } from "@/styles/device";
import { Appearance } from "@/views/settings/Appearance";
import { InfoView } from "@/views/settings/InfoView";
import { FilterOptions } from "./FilterOptions";
import { OBSSettings } from "./OBSSettings";
import { PlaybackSettings } from "./PlaybackSettings";
import { SlippiPage } from "./SlippiPage";
import { SoundSettings } from "./SoundSettings";
import { TwitchIntegration } from "./TwitchIntegration";

import OBSLogo from "@/styles/images/obs.svg";
import SlippiLogo from "@/styles/images/slippi-logo.svg";

const StyledMenuItem = styled(Menu.Item) <{
    header: boolean;
}>`
&&& {
    color: ${({ theme }) => theme.foreground} !important;
    margin-top: 2px !important;
    margin-bottom: 2px !important;
    &.active {
        background: ${({ theme }) => transparentize(0.05, theme.foreground3)} !important;
    }
    &:not(.header):hover {
        background: ${({ theme }) => transparentize(0.3, theme.foreground3)} !important;
    }
    ${p => p.header && `
    font-variant: all-small-caps !important;
    font-size: 15px !important;
    `}
}
`;

const BottomMenuSection = styled.div`
padding-top: 10px;
padding-bottom: 10px;
border-top: solid 1px ${({ theme }) => theme.foreground3};
margin-top: 20px
`;

const MenuColumn = styled.div`
flex-basis: 100%;
overflow: hidden;
overflow-y: auto;
height: 100vh;
color: ${({ theme }) => theme.foreground};
background-color: ${({ theme }) => theme.background};
border-right: solid 1px ${({ theme }) => theme.background3};
@media ${device.mobileL} {
    flex-basis: 40%;
}
@media ${device.tablet} {
    flex-basis: 30%;
}
@media ${device.laptop} {
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
    padding-bottom: 50px;
    padding-top: 50px;
    padding-right: 100px;
}
`;
const StyledMenu = styled(Menu)`
&&& {
    height: 100%;
    width: 100%;
    a.item {
        & > i.icon {
            float: left;
            margin-right: 10px;
            margin-left: 0;
        }
    }
}
`;
const MenuContainer = styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
height: 100%;
padding: 50px;
@media ${device.mobileL} {
    padding-top: 20px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 0;
}
`;
const CloseButton = styled.div`
    font-size: 25px;
    position: fixed;
    top: 20px;
    right: 40px;
`;

export const SettingsPage: React.FC<{
    showSettings: boolean;
    onClose: () => void;
}> = props => {
    const { path } = useRouteMatch();
    const history = useHistory();

    const isActive = (name: string): boolean => {
        return history.location.pathname.includes(name);
    };

    // Close settings page on Escape
    const escFunction = React.useCallback((event) => {
        if (event.keyCode === 27) {
            props.onClose();
        }
    }, []);

    React.useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => document.removeEventListener("keydown", escFunction, false);
    }, []);

    const handleItemClick = (_: any, { name }: any) => {
        history.push(`${path}/${name}`);
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
        background-color: ${({ theme }) => theme.background2};
        z-index: 1;
        ${!props.showSettings && hiddenSettings}
    `;
    return (
        <SettingsContainer>
            <CloseButton>
                <Labelled onClick={props.onClose} title="Close">
                    <Icon name="close" />
                </Labelled>
            </CloseButton>
            <div style={{ display: "flex" }}>
                <MenuColumn>
                    <StyledMenu secondary={true} vertical={true}>
                        <MenuContainer>
                            <div style={{ flex: "1" }}>
                                <StyledMenuItem header>App Settings</StyledMenuItem>
                                <StyledMenuItem
                                    name="combo-settings"
                                    active={isActive("combo-settings")}
                                    onClick={handleItemClick}
                                ><Icon name="filter" />Combo Filter</StyledMenuItem>
                                <StyledMenuItem
                                    name="sound-settings"
                                    active={isActive("sound-settings")}
                                    onClick={handleItemClick}
                                ><Icon name="music" />Sounds</StyledMenuItem>
                                <StyledMenuItem
                                    name="playback-settings"
                                    active={isActive("playback-settings")}
                                    onClick={handleItemClick}
                                ><Icon name="play circle" />Playback</StyledMenuItem>
                                <StyledMenuItem
                                    name="appearance-settings"
                                    active={isActive("appearance-settings")}
                                    onClick={handleItemClick}
                                ><Icon name="paint brush" />Appearance</StyledMenuItem>
                                <StyledMenuItem header>Connection Settings</StyledMenuItem>
                                <StyledMenuItem
                                    name="slippi-settings"
                                    active={isActive("slippi-settings")}
                                    onClick={handleItemClick}
                                ><CustomIcon image={SlippiLogo} />Slippi Connection</StyledMenuItem>
                                <StyledMenuItem
                                    name="obs-settings"
                                    active={isActive("obs-settings")}
                                    onClick={handleItemClick}
                                ><CustomIcon image={OBSLogo} />OBS Configuration</StyledMenuItem>
                                <StyledMenuItem
                                    name="account-settings"
                                    active={isActive("account-settings")}
                                    onClick={handleItemClick}
                                ><Icon name="twitch" />Twitch Integration</StyledMenuItem>
                            </div>
                            <BottomMenuSection>
                                <StyledMenuItem
                                    name="app-info"
                                    active={isActive("app-info")}
                                    onClick={handleItemClick}
                                ><Icon name="info circle" />Info</StyledMenuItem>
                            </BottomMenuSection>
                        </MenuContainer>
                    </StyledMenu>
                </MenuColumn>
                <ContentColumn>
                    <div>
                        <Switch>
                            <Route path={`${path}/combo-settings`} component={FilterOptions} />
                            <Route path={`${path}/sound-settings`} component={SoundSettings} />
                            <Route path={`${path}/appearance-settings`} component={Appearance} />
                            <Route path={`${path}/playback-settings`} component={PlaybackSettings} />

                            <Route path={`${path}/slippi-settings`} component={SlippiPage} />
                            <Route path={`${path}/obs-settings`} component={OBSSettings} />
                            <Route path={`${path}/account-settings`} component={TwitchIntegration} />

                            <Route path={`${path}/app-info`} component={InfoView} />
                            <Route exact path={path}>
                                <Redirect to={`${path}/combo-settings`} />
                            </Route>
                        </Switch>
                    </div>
                </ContentColumn>
            </div>
        </SettingsContainer>
    );
};
