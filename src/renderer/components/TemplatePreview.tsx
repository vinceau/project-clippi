import * as React from "react";

import { parseFileRenameFormat } from "common/context";
import { GameStartType } from "@vinceau/slp-realtime";

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
