import * as React from "react";

import { iRootState } from "@/store";
import { transparentize } from "polished";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { Icon, Label, Menu } from "semantic-ui-react";
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

import { SlippiIcon } from "@/components/SlippiIcon";
import { needsUpdate } from "@/lib/checkForUpdates";
import OBSLogo from "@/styles/images/obs.svg";

const StyledMenuItem = styled(Menu.Item)<{
  header: boolean;
}>`
  &&& {
    font-size: 1.4rem !important;
    color: ${({ theme }) => theme.foreground} !important;
    margin-top: 0.2rem !important;
    margin-bottom: 0.2rem !important;
    &.active {
      background: ${({ theme }) => transparentize(0.05, theme.foreground3)} !important;
    }
    &:not(.header):hover {
      background: ${({ theme }) => transparentize(0.3, theme.foreground3)} !important;
    }
    ${(p) =>
      p.header &&
      `
    font-variant: all-small-caps !important;
    font-size: 1.6rem !important;
    `}
  }
`;

const BottomMenuSection = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-top: solid 0.1rem ${({ theme }) => theme.foreground3};
  margin-top: 2rem;
`;

const MenuColumn = styled.div`
  flex-basis: 100%;
  overflow: hidden;
  overflow-y: auto;
  height: 100vh;
  color: ${({ theme }) => theme.foreground};
  background-color: ${({ theme }) => theme.background};
  border-right: solid 0.1rem ${({ theme }) => theme.background3};
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
  padding-left: 2.5rem;
  @media ${device.mobileL} {
    flex-basis: 70%;
  }
  @media ${device.tablet} {
    flex-basis: 75%;
  }
  & > div {
    padding-bottom: 5rem;
    padding-top: 5rem;
    padding-right: 10rem;
  }
`;
const StyledMenu = styled(Menu)`
  &&& {
    height: 100%;
    width: 100%;
    a.item {
      & > i.icon {
        float: left;
        margin-right: 1rem;
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
  padding: 5rem;
  @media ${device.mobileL} {
    padding-top: 2rem;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-bottom: 0;
  }
`;
const CloseButton = styled.div`
  font-size: 2rem;
  position: fixed;
  top: 2rem;
  right: 4rem;
`;
const InfoLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SettingsPage: React.FC<{
  showSettings: boolean;
  onClose: () => void;
}> = (props) => {
  const { latestVersion } = useSelector((state: iRootState) => state.appContainer);
  const { path } = useRouteMatch();
  const history = useHistory();

  const updateAvailable = needsUpdate(latestVersion);
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
                <StyledMenuItem name="combo-settings" active={isActive("combo-settings")} onClick={handleItemClick}>
                  <Icon name="filter" />
                  Combo Filter
                </StyledMenuItem>
                <StyledMenuItem name="sound-settings" active={isActive("sound-settings")} onClick={handleItemClick}>
                  <Icon name="music" />
                  Sounds
                </StyledMenuItem>
                <StyledMenuItem
                  name="playback-settings"
                  active={isActive("playback-settings")}
                  onClick={handleItemClick}
                >
                  <Icon name="play circle" />
                  Playback
                </StyledMenuItem>
                <StyledMenuItem
                  name="appearance-settings"
                  active={isActive("appearance-settings")}
                  onClick={handleItemClick}
                >
                  <Icon name="paint brush" />
                  Appearance
                </StyledMenuItem>
                <StyledMenuItem header>Connection Settings</StyledMenuItem>
                <StyledMenuItem name="slippi-settings" active={isActive("slippi-settings")} onClick={handleItemClick}>
                  <SlippiIcon />
                  Slippi Connection
                </StyledMenuItem>
                <StyledMenuItem name="obs-settings" active={isActive("obs-settings")} onClick={handleItemClick}>
                  <CustomIcon image={OBSLogo} />
                  OBS Configuration
                </StyledMenuItem>
                <StyledMenuItem name="account-settings" active={isActive("account-settings")} onClick={handleItemClick}>
                  <Icon name="twitch" />
                  Twitch Integration
                </StyledMenuItem>
              </div>
              <BottomMenuSection>
                <StyledMenuItem name="app-info" active={isActive("app-info")} onClick={handleItemClick}>
                  <InfoLabel>
                    <span>
                      <Icon name="info circle" /> Info
                    </span>
                    {updateAvailable && <Label circular color="red" empty />}
                  </InfoLabel>
                </StyledMenuItem>
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
