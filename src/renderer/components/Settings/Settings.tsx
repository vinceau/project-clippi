import * as React from "react";

import {
    Route,
    Switch,
    useHistory,
    useRouteMatch,
} from "react-router-dom";

import { ComboFilterSettings } from "@vinceau/slp-realtime";
import { useDispatch, useSelector } from "react-redux";
import { Icon, Menu } from "semantic-ui-react";
import styled, { css } from "styled-components";

import { comboFilter } from "@/lib/realtime";
import { Dispatch, iRootState } from "@/store";
import { device } from "@/styles/device";
import { LabelledButton } from "../LabelledButton";
import { ComboFinder } from "./ComboFinder";
import { ComboForm } from "./ComboForm";
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
    @media ${device.mobileL} {
        flex-basis: 30%;
    }
    `;
    const ContentColumn = styled.div`
    flex-basis: 0%;
    overflow: hidden;
    overflow-y: auto;
    height: 100vh;
    @media ${device.mobileL} {
        flex-basis: 70%;
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
                <LabelledButton onClick={props.onClose} title="Close">
                    <Icon name="close" />
                </LabelledButton>
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
                        <Menu.Item header>Action Settings</Menu.Item>
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

const FilterOptions = () => {
    const settings = useSelector((state: iRootState) => state.slippi.settings);
    const initial = comboFilter.updateSettings(JSON.parse(settings));
    const dispatch = useDispatch<Dispatch>();
    const onSubmit = (values: Partial<ComboFilterSettings>) => {
        const valueString = JSON.stringify(values);
        dispatch.slippi.updateSettings(valueString);
    };
    return (
        <div>
            <h2>Filter Options</h2>
            <ComboForm initialValues={initial} onSubmit={onSubmit} />
        </div>
    );
};
