import path from "path";
import React from "react";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";
import { transparentize } from "polished";

const Outer = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding: 10px;
h3 {
    margin: 0;
}
span.path {
    font-size: 12px;
    font-weight: 100;
    opacity: 0.8;
}
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

.content {
    margin-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
                <div className="content">
                    <h3>{basename}</h3>
                    <span className="path">{props.path}</span>
                </div>
            </Details>
            <div><Icon size="large" name="close" /></div>
        </Outer>
    );
};
