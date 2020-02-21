import * as React from "react";

import { MenuIconLink, MenuIcon } from "@/components/layout/MenuIcon";

import styled from "styled-components";
import { Icon } from "semantic-ui-react";

import {
    useHistory,
    useRouteMatch,
    Switch,
    Link,
    Route,
} from "react-router-dom";

export const Menu: React.FC = () => {
    const match = useRouteMatch();
    const Outer = styled.div`
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    `;
    return (
        <Outer>
            <div>
                <MenuIconLink to={`${match.url}/automator`} label="Automator"><Icon name="bolt" /></MenuIconLink>
                <MenuIconLink to={`${match.url}/processor`} label="Replay Processor"><Icon name="fast forward" /></MenuIconLink>
                <MenuIconLink to={`${match.url}/streamer`} label="Stream Assistant"><Icon name="tv" /></MenuIconLink>
            </div>
            <div>
                <MenuIcon label="Settings"><Icon name="cog" /></MenuIcon>
            </div>
        </Outer>
    );
};
