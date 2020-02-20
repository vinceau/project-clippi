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
                <MenuIcon/>
                <MenuIcon/>
                <MenuIcon/>
            </div>
            <div>Settings</div>
        </Outer>
    );
};
