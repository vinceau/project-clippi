import { generateFileRenameContext } from "common/context";
import * as React from "react";
import { Label } from "@/ui/Label/Label";

import { contextDescriptions } from "@/lib/contextDescriptions";
import type { Context } from "@/lib/event_actions";

import { TippyLabel } from "./Labelled";

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
    <div key={cat.category}>
      <b style={{ marginRight: "5px" }}>{cat.category}</b>
      {cat.descriptions
        .filter((d) => keys.includes(d.contextName))
        .map((d) => (
          <TippyLabel
            key={`${cat.category}--${d.contextName}`}
            title={d.description}
            arrow
            duration={200}
            position="top"
            size="big"
          >
            <Label as="a" onClick={() => clickHandler(d.contextName)} style={{ margin: "2px", fontSize: "1.1rem" }}>
              {d.contextName}
            </Label>
          </TippyLabel>
        ))}
    </div>
  ));
  return <div>{descriptions}</div>;
}
