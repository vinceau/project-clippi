import React from "react";

import { remote } from "electron";
import { darkTheme, lightTheme, Theme, ThemeMode } from "./theme";
import { ipc } from "@/lib/rendererIpc";
import { Message } from "common/types";

interface ThemeContext {
  themeName: string;
  theme: Theme;
  toggle: (mode?: string) => void;
}

// Get the theme synchronously
const initialTheme = (remote.getCurrentWindow() as any).getCurrentTheme();

export const ManageThemeContext: React.Context<ThemeContext> = React.createContext({
  themeName: initialTheme,
  theme: initialTheme === ThemeMode.DARK ? darkTheme : lightTheme,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggle: () => {},
});

export const useTheme = (): ThemeContext => React.useContext(ManageThemeContext);

export const ThemeManager: React.FC = ({ children }) => {
  const currentTheme = (remote.getCurrentWindow() as any).getCurrentTheme();

  const [themeState, setThemeState] = React.useState({
    themeName: currentTheme,
    theme: currentTheme === ThemeMode.DARK ? darkTheme : lightTheme,
  });

  React.useEffect(() => {
    remote.nativeTheme.on("updated", () => {
      const useDarkMode = remote.nativeTheme.shouldUseDarkColors;
      setThemeState({
        themeName: useDarkMode ? ThemeMode.DARK : ThemeMode.LIGHT,
        theme: useDarkMode ? darkTheme : lightTheme,
      });
    });
  }, []);

  const toggle = (mode?: string): void => {
    let newMode: "light" | "dark" = themeState.themeName === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
    remote.nativeTheme.themeSource = newMode;
    if (mode && (mode === ThemeMode.LIGHT || mode === ThemeMode.DARK)) {
      newMode = mode;
    }

    // Tell the main process we want to change themes
    ipc.sendMessage(Message.ToggleTheme, { theme: newMode });
  };

  return (
    <ManageThemeContext.Provider
      value={{
        themeName: themeState.themeName,
        theme: themeState.theme,
        toggle,
      }}
    >
      {children}
    </ManageThemeContext.Provider>
  );
};
