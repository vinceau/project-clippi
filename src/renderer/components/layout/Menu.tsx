import * as React from "react";

import { MenuIcon } from "./MenuIcon";

import styled from "styled-components";

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
                <MenuIcon label="Automator" />
                <MenuIcon label="Replay Processor" active={true}/>
                <MenuIcon label="Stream Assistant" />
            </div>
            <div>
                <MenuIcon label="Settings"/>
            </div>
        </Outer>
    );
};
