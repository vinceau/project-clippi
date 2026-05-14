import React from "react";

import { ThemeMode, useTheme } from "@/styles";
import slippiLogoSVG from "@/styles/images/slippi-logo.svg";
import invertedSlippiLogoSVG from "@/styles/images/slippi-logo-invert.svg";

import { CustomIcon } from "@/ui/CustomIcon/CustomIcon";
import type { CustomIconProps } from "@/ui/CustomIcon/CustomIcon";

export const SlippiIcon: React.FC<Omit<CustomIconProps, "image">> = (props) => {
  const { themeName } = useTheme();
  if (themeName === ThemeMode.LIGHT) {
    return <CustomIcon image={invertedSlippiLogoSVG} {...props} />;
  }
  return <CustomIcon image={slippiLogoSVG} {...props} />;
};
