import Store from "electron-store";
import { nativeTheme } from "electron";

const store = new Store();

const CURRENT_THEME_STORE_KEY = "theme";

export const toggleTheme = (theme: "dark" | "light") => {
  store.set(CURRENT_THEME_STORE_KEY, theme);
  nativeTheme.themeSource = theme;
};

export const getCurrentTheme = (): "dark" | "light" => {
  const defaultValue = nativeTheme.shouldUseDarkColors ? "dark" : "light";
  return store.get(CURRENT_THEME_STORE_KEY, defaultValue);
};
