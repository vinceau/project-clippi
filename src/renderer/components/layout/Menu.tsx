import * as React from "react";

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
            <div>Automator</div>
            <div>Settings</div>
        </Outer>
    );
};
