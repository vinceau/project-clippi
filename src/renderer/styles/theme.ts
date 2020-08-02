import { lightTheme as light, darkTheme as dark } from "common/theme";
import { Theme } from "@emotion/styled";

// Re-export the theme
export { Theme } from "@emotion/styled";

export enum ThemeMode {
  DARK = "dark",
  LIGHT = "light",
}

// Re-export the common theme as the @emotion/styled theme
export const lightTheme = light as Theme;
export const darkTheme = dark as Theme;
