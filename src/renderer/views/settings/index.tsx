import { clsx } from "clsx";
import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { X as Close, Filter, Music, CirclePlay, Brush, Info } from "lucide-react";
import { Label } from "@/ui/Label/Label";
import { Menu } from "@/views/settings/menu/Menu";
import twitchIcon from "@/styles/images/twitch.svg";

import { CustomIcon } from "@/ui/CustomIcon/CustomIcon";
import { Tooltip } from "@/ui/Tooltip/Tooltip";
import { SlippiIcon } from "@/components/SlippiIcon";
import type { iRootState } from "@/store";
import OBSLogo from "@/styles/images/obs.svg";
import { Appearance } from "@/views/settings/Appearance";
import { InfoView } from "@/views/settings/InfoView";

import { FilterOptions } from "./FilterOptions";
import { OBSSettings } from "./OBSSettings";
import { PlaybackSettings } from "./PlaybackSettings";
import { SlippiPage } from "./SlippiPage";
import { SoundSettings } from "./SoundSettings";
import { TwitchIntegration } from "./TwitchIntegration";

import styles from "./index.module.css";

export function SettingsView() {
  const history = useHistory();
  const { path } = useRouteMatch();
  const latestPath = useSelector((state: iRootState) => state.tempContainer.latestPath);
  const updateAvailable = useSelector((state: iRootState) => state.tempContainer.updateAvailable);

  const mainPage = latestPath.main || "/";

  const onClose = () => history.push(mainPage);

  const isActive = (name: string): boolean => {
    return history.location.pathname.includes(name);
  };

  const escFunction = React.useCallback((event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      onClose();
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => document.removeEventListener("keydown", escFunction, false);
  }, []);

  const handleItemClick = (_: any, { name }: any) => {
    history.push(`${path}/${name}`);
  };
  return (
    <div className={styles.settingsContainer}>
      <div className={styles.closeButton}>
        <Tooltip onClick={onClose} title="Close">
          <Close size={20} />
        </Tooltip>
      </div>
      <div className={styles.flex}>
        <div className={styles.menuColumn}>
          <Menu className={styles.styledMenu} secondary vertical>
            <div className={styles.menuContainer}>
              <div className={styles.flex1}>
                <Menu.Item className={clsx(styles.styledMenuItem, styles.styledMenuItemHeader)} header>
                  App Settings
                </Menu.Item>
                <Menu.Item
                  name="combo-settings"
                  className={styles.styledMenuItem}
                  active={isActive("combo-settings")}
                  onClick={handleItemClick}
                >
                  <Filter size={16} />
                  Combo Filter
                </Menu.Item>
                <Menu.Item
                  name="sound-settings"
                  className={styles.styledMenuItem}
                  active={isActive("sound-settings")}
                  onClick={handleItemClick}
                >
                  <Music size={16} />
                  Sounds
                </Menu.Item>
                <Menu.Item
                  name="playback-settings"
                  className={styles.styledMenuItem}
                  active={isActive("playback-settings")}
                  onClick={handleItemClick}
                >
                  <CirclePlay size={16} />
                  Playback
                </Menu.Item>
                <Menu.Item
                  name="appearance-settings"
                  className={styles.styledMenuItem}
                  active={isActive("appearance-settings")}
                  onClick={handleItemClick}
                >
                  <Brush size={16} />
                  Appearance
                </Menu.Item>
                <Menu.Item className={clsx(styles.styledMenuItem, styles.styledMenuItemHeader)} header>
                  Connection Settings
                </Menu.Item>
                <Menu.Item
                  name="slippi-settings"
                  className={styles.styledMenuItem}
                  active={isActive("slippi-settings")}
                  onClick={handleItemClick}
                >
                  <SlippiIcon style={{ width: "18px", height: "18px" }} />
                  Slippi Connection
                </Menu.Item>
                <Menu.Item
                  name="obs-settings"
                  className={styles.styledMenuItem}
                  active={isActive("obs-settings")}
                  onClick={handleItemClick}
                >
                  <CustomIcon image={OBSLogo} style={{ width: "18px", height: "18px" }} />
                  OBS Configuration
                </Menu.Item>
                <Menu.Item
                  name="account-settings"
                  className={styles.styledMenuItem}
                  active={isActive("account-settings")}
                  onClick={handleItemClick}
                >
                  <CustomIcon image={twitchIcon} style={{ width: "18px", height: "18px" }} />
                  Twitch Integration
                </Menu.Item>
              </div>
              <div className={styles.bottomMenuSection}>
                <Menu.Item
                  name="app-info"
                  className={styles.styledMenuItem}
                  active={isActive("app-info")}
                  onClick={handleItemClick}
                >
                  <div className={styles.infoLabel}>
                    <span>
                      <Info size={16} /> Info
                    </span>
                    {updateAvailable && <Label circular color="red" empty />}
                  </div>
                </Menu.Item>
              </div>
            </div>
          </Menu>
        </div>
        <div className={styles.contentColumn}>
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
        </div>
      </div>
    </div>
  );
}
