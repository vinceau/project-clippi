import { Theme } from "@emotion/styled";

// Re-export the theme
export { Theme } from "@emotion/styled";

export enum ThemeMode {
  DARK = "dark",
  LIGHT = "light",
}

export const lightTheme: Theme = {
  primary: "#FFF",
  secondary: "#000",
  foreground: "#333",
  foreground2: "#111329",
  foreground3: "#ddd",
  background: "#FAFAFA",
  background2: "#F9FAFB",
  background3: "#d4d4d5",
};

// Color palette: https://paletton.com/#uid=13X0u0k8Zaw6JmT8khnfM8Ll-7w
export const darkTheme: Theme = {
  primary: "#000",
  secondary: "#FFF",
  foreground: "#cbcbce",
  foreground2: "#67697E",
  foreground3: "#4A4C60",
  background: "#22222C",
  background2: "#1C1D30",
  background3: "#111329",
};
