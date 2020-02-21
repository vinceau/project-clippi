import * as React from "react";

import { MenuIcon } from "./MenuIcon";

import styled from "styled-components";
import { Icon } from "semantic-ui-react";

export const Menu: React.FC = () => {
    const Outer = styled.div`
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    `; 
    return (
        <Outer>
            <div>
                <MenuIcon label="Automator"><Icon name="pencil" /></MenuIcon>
                <MenuIcon label="Replay Processor" active={true}><Icon name="fast forward" /></MenuIcon>
                <MenuIcon label="Stream Assistant"><Icon name="podcast" /></MenuIcon>
            </div>
            <div>
                <MenuIcon label="Settings"><Icon name="cog" /></MenuIcon>
            </div>
        </Outer>
    );
};
