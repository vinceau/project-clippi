import * as React from "react";

import { GameStartType } from "@vinceau/slp-realtime";
import { parseFileRenameFormat } from "common/context";

export const TemplatePreview: React.FC<{
    template: string;
    settings?: GameStartType,
    metadata?: any,
}> = (props) => {
    const parsedTemplate = parseFileRenameFormat(props.template, props.settings, props.metadata);
    return (
    <span>{parsedTemplate}</span>
    );
};
