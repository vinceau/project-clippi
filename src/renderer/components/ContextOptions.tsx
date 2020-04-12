
import * as React from "react";

import { Context } from "@vinceau/event-actions";
import { Label } from "semantic-ui-react";

import { generateFileRenameContext } from "common/context";
import { contextDescriptions } from "@/lib/contextDescriptions";
import { TippyLabel } from "./Labelled";

export const ContextOptions: React.FC<{
    onLabelClick?: (name: string) => void;
    context?: Context
}> = props => {
    const context = props.context ? props.context : generateFileRenameContext();
    const allDescriptions = contextDescriptions;
    const keys = Object.keys(context);
    const clickHandler = (name: string) => {
        if (props.onLabelClick) {
            props.onLabelClick(name);
        }
    };
    const descriptions = allDescriptions.map(cat => (
        <div key={cat.category}>
        <b style={{marginRight: "5px"}}>{cat.category}</b>
        {cat.descriptions.filter(d => keys.includes(d.contextName)).map(d => (
            <TippyLabel
                key={`${cat.category}--${d.contextName}`}
                title={d.description}
                arrow={true}
                duration={200}
                position="top"
            >
                <Label as="a" onClick={() => clickHandler(d.contextName)} style={{margin: "2px"}}>{d.contextName}</Label>
            </TippyLabel>
        ))}
        </div>
    ));
    return (
        <div>
        {descriptions}
        </div>
    );
};
