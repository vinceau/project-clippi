import * as React from "react";
import type { TooltipProps } from "react-tippy";
import { Tooltip as TippyTooltip } from "react-tippy";

import { ThemeMode, useTheme } from "@/styles";

type TippyLabelProps = {
  style?: React.CSSProperties;
} & TooltipProps;

const TooltipAny = TippyTooltip as unknown as React.ComponentType<{ children?: React.ReactNode; [key: string]: any }>;

export function TippyLabel({ children, style, ...rest }: React.PropsWithChildren<TippyLabelProps>) {
  const { themeName } = useTheme();
  return (
    <TooltipAny
      theme={themeName === ThemeMode.LIGHT ? "dark" : "light"}
      style={{ display: "inline-block", ...style }}
      {...rest}
    >
      {children}
    </TooltipAny>
  );
}

type LabelledProps = {
  onClick?: () => void;
  style?: React.CSSProperties;
} & Pick<TippyLabelProps, "position" | "title" | "disabled">;

export function Labelled({ onClick, children, ...rest }: React.PropsWithChildren<LabelledProps>) {
  const pointerStyle = {
    cursor: "pointer",
  };
  return (
    <span style={onClick ? pointerStyle : undefined} onClick={onClick}>
      <TippyLabel size="big" arrow duration={200} position="bottom" {...rest}>
        {children}
      </TippyLabel>
    </span>
  );
}
