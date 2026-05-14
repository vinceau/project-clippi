import { darkTheme as dark, lightTheme as light } from "common/theme";

export interface Theme {
  primary: string;
  secondary: string;
  foreground: string;
  foreground2: string;
  foreground3: string;
  background: string;
  background2: string;
  background3: string;
}

export enum ThemeMode {
  DARK = "dark",
  LIGHT = "light",
}

export const lightTheme = light as Theme;
export const darkTheme = dark as Theme;
