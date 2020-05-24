import { ThemeMode, useTheme } from "@/styles";
import path from "path";
import { transparentize } from "polished";
import { darken, lighten } from "polished";
import React from "react";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";
import { Labelled } from "../Labelled";

import { DolphinEntry } from "@vinceau/slp-realtime";
import { Draggable } from "react-beautiful-dnd";

const Outer = styled.div<{
    themeName: string;
    isDragging: boolean;
}>`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding: 10px;
border-bottom: solid 1px ${p => transparentize(0.8, p.theme.foreground)};
background-color: ${p => {
    const adjust = p.themeName === ThemeMode.DARK ? lighten : darken;
    return adjust(0.1, p.theme.background);
}};
.remove-icon {
    cursor: pointer;
    opacity: 0;
    padding: 5px;
}
${p => p.isDragging && `
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    &&&,
`}
&:hover {
    background-color: ${p => {
        const adjust = p.themeName === ThemeMode.DARK ? lighten : darken;
        return adjust(0.15, p.theme.background);
    }};
    .remove-icon {
        opacity: 1;
    }
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
    index: number;
    total?: number;
    file: DolphinEntry;
    onRemove?: () => void;
}> = props => {
    const theme = useTheme();
    const { index, file, onRemove, total } = props;
    const basename = path.basename(file.path);
    const dirname = path.dirname(file.path);
    return (
        <Draggable draggableId={JSON.stringify(file)} index={index}>
            {(provided, snapshot) => (
                <Outer themeName={theme.themeName}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                >
                    <Details>
                        <Labelled title={`${index + 1}${total && ` of ${total}`}`}><Icon size="big" name="file outline" /></Labelled>
                        <DetailsContent>
                            <h3>{basename}</h3>
                            <span>{dirname}</span>
                        </DetailsContent>
                    </Details>
                    <Labelled title="Remove">
                        <div className="remove-icon" onClick={onRemove}>
                            <Icon size="large" name="close" />
                        </div>
                    </Labelled>
                </Outer>
            )}
        </Draggable>
    );
};
