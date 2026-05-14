/* eslint-disable @typescript-eslint/no-explicit-any */
import { IS_DEV } from "common/constants";
import * as React from "react";

export function CodeBlock({ values }: { values: Record<string, any> }) {
  if (IS_DEV) {
    return <pre style={{ overflowX: "auto" }}>{(JSON as any).stringify(values, 0, 2)}</pre>;
  }
  return null;
}
