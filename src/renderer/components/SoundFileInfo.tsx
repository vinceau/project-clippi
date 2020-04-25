import React from "react";

import { transparentize } from "polished";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";
import { Labelled } from "./Labelled";

const Container = styled.div`
border: solid 1px ${({ theme }) => theme.background3}
border-radius: 3px;
margin-bottom: 5px;
padding: 10px;
display: flex;
justify-content: space-between;
align-items: center;
word-break: break-all;
background-color: ${({ theme }) => transparentize(0.3, theme.foreground3)};
a {
    color: ${({ theme }) => theme.foreground}

}
h2 {
    font-size: 18px;
    margin: 0;
    margin-bottom: 5px;
    cursor: pointer;
}
`;

export const SoundFileInfo: React.FC<{
    name: string;
    path: string;
    onPathClick: () => void;
    onRemove: () => void;
}> = props => {
    const pathClick = (e: any) => {
        e.preventDefault();
        props.onPathClick();
    };
    return (
        <Container>
            <div>
                <Labelled title="Open location"><h2 onClick={pathClick}>{props.name}</h2></Labelled>
                <div>
                    {props.path}
                </div>
            </div>
            <div style={{fontSize: "20px"}}>
                <Labelled title="Remove"><Icon name="trash" onClick={props.onRemove} /></Labelled>
            </div>
        </Container>
    );
};
