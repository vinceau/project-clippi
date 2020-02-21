import React from "react";

import { lightTheme, darkTheme, Theme } from "./theme";

export enum ThemeMode {
    DARK = "dark",
    LIGHT = "light",
}

const THEME_STORAGE_KEY = "theme";

const defaultMode = ThemeMode.DARK;

interface ThemeContext {
    themeName: string;
    theme: Theme;
    toggle: (mode?: string) => void;
}

const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || defaultMode;

export const ManageThemeContext: React.Context<ThemeContext> = React.createContext({
  themeName: currentTheme,
  theme: currentTheme === ThemeMode.DARK ? darkTheme : lightTheme,
  toggle: () => { console.log("hello world") },
});

export const useTheme = () => React.useContext(ManageThemeContext);

export const ThemeManager: React.FC = ({ children }) => {
  const [themeState, setThemeState] = React.useState({
    themeName: currentTheme,
    theme: currentTheme === ThemeMode.DARK ? darkTheme : lightTheme,
  });

  const toggle = (mode?: string): void => {
      console.log("toggling...");
    // Invert the theme
    let newMode = themeState.themeName === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
    if (mode && (mode === ThemeMode.LIGHT || mode === ThemeMode.DARK) ) {
        newMode = mode;
    }
    setThemeState({
        themeName: newMode,
        theme: newMode === ThemeMode.DARK ? darkTheme : lightTheme,
    });
    localStorage.setItem(THEME_STORAGE_KEY, newMode);
  };

  return (
    <ManageThemeContext.Provider value={{
      themeName: themeState.themeName,
      theme: themeState.theme,
      toggle,
    }}>
      {children}
    </ManageThemeContext.Provider>
  );
};
