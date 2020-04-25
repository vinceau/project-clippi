import * as React from "react";

import { isDevelopment } from "@/lib/utils";

export const CodeBlock: React.FC<{
    values: any
}> = (props) => {
    if (isDevelopment) {
        return (<pre style={{overflowX: "auto"}}>{(JSON as any).stringify(props.values, 0, 2)}</pre>);
    }
    return null;
};
