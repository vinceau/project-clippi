import * as React from "react";

import {
    Link as LinkContainer,
    Redirect,
    Route,
    Switch,
    useRouteMatch
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { Dispatch, iRootState } from "@/store";

import { comboFilter } from "@/lib/realtime";
import { ComboFilterSettings } from "@vinceau/slp-realtime";
import styled, { css } from "styled-components";
import { ComboFinder } from "./ComboFinder";
import { ComboForm } from "./ComboForm";

export const SettingsPage: React.FC<{
    showSettings: boolean;
}> = props => {
    const { path } = useRouteMatch();
    const hiddenSettings = css`
    visibility: hidden;
    overflow: hidden;
    height: 0;
    `;
    const SettingsContainer = styled.div`
        position: absolute;
        width: 100%;
        height: auto;
        visibility: visible;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.95);
        z-index: 1;
        ${!props.showSettings && hiddenSettings}
    `;
    return (
        <SettingsContainer>
            <h2>Settings</h2>

            {/* <Redirect strict from={path} to={`${path}/profile`} /> */}

<div style={{display: "flex"}}>
<div style={{display: "flex", flexDirection: "column"}}>
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
