import * as React from "react";
import type { TooltipProps } from "react-tippy";
import { Tooltip } from "react-tippy";

import { ThemeMode, useTheme } from "@/styles";

type TippyLabelProps = {
  style?: React.CSSProperties;
} & TooltipProps;

export const TippyLabel = ({ children, style, ...rest }: React.PropsWithChildren<TippyLabelProps>) => {
  const { themeName } = useTheme();
  return (
    <Tooltip
      theme={themeName === ThemeMode.LIGHT ? "dark" : "light"}
      style={{ display: "inline-block", ...style }}
      {...rest}
    >
      {children}
    </Tooltip>
  );
};

type LabelledProps = {
  onClick?: () => void;
  style?: React.CSSProperties;
} & Pick<TippyLabelProps, "position" | "title" | "disabled">;

export const Labelled = ({ onClick, children, ...rest }: React.PropsWithChildren<LabelledProps>) => {
  const pointerStyle = {
    cursor: "pointer",
  };
  return (
    <span style={onClick ? pointerStyle : undefined} onClick={onClick}>
      <TippyLabel size="big" arrow={true} duration={200} position="bottom" {...rest}>
        {children}
      </TippyLabel>
    </span>
  );
};
