/* eslint-disable @typescript-eslint/no-explicit-any */
import { IS_DEV } from "common/constants";
import * as React from "react";

export const CodeBlock: React.FC<{
  values: Record<string, any>;
}> = (props) => {
  if (IS_DEV) {
    return <pre style={{ overflowX: "auto" }}>{(JSON as any).stringify(props.values, 0, 2)}</pre>;
  }
  return null;
};
