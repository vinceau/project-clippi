import * as React from "react";

import { parseFileRenameFormat } from "@/lib/context";

export const TemplatePreview: React.FC<{
    template: string;
}> = (props) => {
    const parsedTemplate = parseFileRenameFormat(props.template);
    return (
    <span>{parsedTemplate}</span>
    );
};
