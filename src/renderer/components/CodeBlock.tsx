/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

import { IS_DEV } from "common/constants";

export const CodeBlock: React.FC<{
  values: Record<string, any>;
}> = (props) => {
  if (IS_DEV) {
    return <pre style={{ overflowX: "auto" }}>{(JSON as any).stringify(props.values, 0, 2)}</pre>;
  }
  return null;
};
