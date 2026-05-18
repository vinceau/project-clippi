import React from "react";
import { Tooltip, TooltipProps } from "@/ui/Tooltip/Tooltip";

type LabelledProps = Omit<TooltipProps, "position">;

export function Labelled({ onClick, children, disabled, title }: React.PropsWithChildren<LabelledProps>) {
  return (
    <Tooltip position="bottom" disabled={disabled} title={title} onClick={onClick}>
      {children}
    </Tooltip>
  );
}
