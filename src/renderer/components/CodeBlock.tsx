/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

import { isDevelopment } from "common/utils";

export const CodeBlock: React.FC<{
  values: Record<string, any>;
}> = (props) => {
  if (isDevelopment) {
    return <pre style={{ overflowX: "auto" }}>{(JSON as any).stringify(props.values, 0, 2)}</pre>;
  }
  return null;
};
