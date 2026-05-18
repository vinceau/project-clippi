import React from "react";
import { Tooltip } from "@/ui/Tooltip/Tooltip";

type TippyLabelProps = {
  style?: React.CSSProperties;
  title?: string;
  position?: "top" | "bottom" | "left" | "right";
  disabled?: boolean;
  [key: string]: unknown;
};

export function TippyLabel({ children, style, title, position, disabled }: React.PropsWithChildren<TippyLabelProps>) {
  return (
    <span style={{ display: "inline-block", ...style }}>
      <Tooltip title={title ?? ""} position={position} disabled={disabled}>
        {children}
      </Tooltip>
    </span>
  );
}

type LabelledProps = {
  onClick?: () => void;
  style?: React.CSSProperties;
} & Pick<TippyLabelProps, "position" | "title" | "disabled">;

export function Labelled({ onClick, children, ...rest }: React.PropsWithChildren<LabelledProps>) {
  return (
    <span style={onClick ? { cursor: "pointer" } : undefined} onClick={onClick}>
      <TippyLabel position="bottom" {...rest}>
        {children}
      </TippyLabel>
    </span>
  );
}
