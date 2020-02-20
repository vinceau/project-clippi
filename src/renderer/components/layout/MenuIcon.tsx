import * as React from "react";

import styled from "styled-components";
import { Icon } from "semantic-ui-react";

export const MenuIcon: React.FC = (props) => {
    const Outer = styled.div`
        border-right: solid 4px white;
        height: 70px;
        width: 70px;
        color: white;
        background-color: rgba(255, 255, 255, 0.05);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 25px;
    `;
    return (
        <Outer>
            <Icon name="fast forward" />
        </Outer>
    );
};
