import React from "react";

import { remote } from "electron";
import { darkTheme, lightTheme, Theme, ThemeMode } from "./theme";
import { ipc } from "@/lib/rendererIpc";
import { Message } from "common/types";
import Store from "electron-store";

const store = new Store();

interface ThemeContext {
  themeName: string;
  theme: Theme;
  toggle: (mode?: string) => void;
}

const currentTheme = store.get("theme");
console.log(`current theme is: ${currentTheme}`);

export const ManageThemeContext: React.Context<ThemeContext> = React.createContext({
  themeName: currentTheme,
  theme: currentTheme === ThemeMode.DARK ? darkTheme : lightTheme,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggle: () => {},
});

export const useTheme = (): ThemeContext => React.useContext(ManageThemeContext);

export const ThemeManager: React.FC = ({ children }) => {
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
