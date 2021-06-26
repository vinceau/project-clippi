import * as React from "react";

import { ThemeMode, useTheme } from "@/styles";
import { Tooltip } from "react-tippy";

export const TippyLabel = (props: any) => {
  const { children, style, ...rest } = props;
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

export const Labelled = (props: any) => {
  const { className, onClick, children, ...rest } = props;
  const pointerStyle = {
    cursor: "pointer",
  };
  return (
    <span style={onClick ? pointerStyle : undefined} onClick={onClick} className={className}>
      <TippyLabel size="big" arrow={true} duration={200} position="bottom" {...rest}>
        {children}
      </TippyLabel>
    </span>
  );
};
