import { generateFileRenameContext } from "common/context";
import * as React from "react";
import { Label } from "@/ui/Label/Label";

import { contextDescriptions } from "@/lib/contextDescriptions";
import type { Context } from "@/lib/event_actions";

import { Tooltip } from "@/ui/Tooltip/Tooltip";

export function ContextOptions({
  onLabelClick,
  context: contextProp,
}: {
  onLabelClick?: (name: string) => void;
  context?: Context;
}) {
  const context = contextProp || generateFileRenameContext();
  const allDescriptions = contextDescriptions;
  const keys = Object.keys(context);
  const clickHandler = (name: string) => {
    if (onLabelClick) {
      onLabelClick(name);
    }
  };
  const descriptions = allDescriptions.map((cat) => (
    <div key={cat.category} style={{ marginTop: "4px" }}>
      <b style={{ marginRight: "5px" }}>{cat.category}</b>
      <div style={{ display: "inline-flex", flexWrap: "wrap", gap: "2px", marginTop: "4px" }}>
        {cat.descriptions
          .filter((d) => keys.includes(d.contextName))
          .map((d) => (
            <Tooltip key={`${cat.category}--${d.contextName}`} title={d.description} position="top">
              <Label as="a" onClick={() => clickHandler(d.contextName)}>
                {d.contextName}
              </Label>
            </Tooltip>
          ))}
      </div>
    </div>
  ));
  return <div>{descriptions}</div>;
}
