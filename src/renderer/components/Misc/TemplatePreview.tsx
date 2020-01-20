import * as React from "react";

import { generateFileRenameContext, parseFileRenameFormat } from "@/lib/context";
import { contextDescriptions } from "@/lib/contextDescriptions";
import { Context } from "@vinceau/event-actions";
import { Label } from "semantic-ui-react";
import { Tooltip } from "react-tippy";

export const TemplatePreview: React.FC<{
    template: string;
}> = (props) => {
    const parsedTemplate = parseFileRenameFormat(props.template);
    return (
    <span>{parsedTemplate}</span>
    );
};

export const ContextOptions: React.FC<{
    context?: Context
}> = props => {
    const context = props.context ? props.context : generateFileRenameContext();
    const allDescriptions = contextDescriptions;
    const keys = Object.keys(context);
    console.log(keys);
    const descriptions = allDescriptions.map(cat => (
        <div key={cat.category}>
        <h5>{cat.category}</h5>
        {cat.descriptions.filter(d => keys.includes(d.contextName)).map(d => (
            <Tooltip
                key={`${cat.category}--${d.contextName}`}
                title={d.description}
                arrow={true}
                duration={200}
                position="top"
                style={{ display: "inline-block" }}
            >
                <Label>{d.contextName}</Label>
            </Tooltip>
        ))}
        </div>
    ));
    return (
        <div>
        {descriptions}
        </div>
    );
};
