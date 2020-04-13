import path from "path";
import React from "react";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";
import { transparentize } from "polished";
import { Labelled } from "../Labelled";

const Outer = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding: 10px;
border-bottom: solid 1px ${p => transparentize(0.8, p.theme.foreground)};
&:last-child {
    border-bottom: none;
}
`;

const Details = styled.div`
display: flex;
flex-direction: row;
align-items: center;
min-width: 0;
padding-right: 20px;
opacity: 0.8;
`;

const DetailsContent = styled.div`
margin-left: 10px;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;

h3 {
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
}
span {
    font-size: 12px;
    font-weight: 100;
}
`;

export const PlaybackQueueItem: React.FC<{
    path: string;
    onRemove?: () => void;
}> = props => {
    const basename = path.basename(props.path);
    return (
        <Outer>
            <Details>
                <Icon size="big" name="file outline" />
                <DetailsContent>
                    <h3>{basename}</h3>
                    <span>{props.path}</span>
                </DetailsContent>
            </Details>
            <Labelled title="Remove"><Icon link size="large" name="close" onClick={props.onRemove} /></Labelled>
        </Outer>
    );
};
