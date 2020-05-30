import React from "react";

import { hot } from "react-hot-loader/root";
import { useDispatch } from "react-redux";
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "emotion-theming";

import { History } from "@/components/History";
import { ToastContainer } from "@/components/toasts/ToastContainer";
import { Dispatch } from "@/store";
import { darkTheme, GlobalStyle, lightTheme, ThemeManager, ThemeMode, useTheme } from "@/styles";
import { MainView, SettingsView } from "@/views";

const App: React.FC = () => {
  const dispatch = useDispatch<Dispatch>();
  const theme = useTheme();
  React.useEffect(() => {
    dispatch.appContainer.checkForUpdates();
  }, []);
  return (
    <div className={theme.themeName}>
      <History />
      <ToastContainer />
      <ThemeProvider theme={theme.themeName === ThemeMode.LIGHT ? lightTheme : darkTheme}>
        <GlobalStyle />
        <Switch>
          <Route path="/main" component={MainView} />
          <Route path="/settings" component={SettingsView} />
          <Route exact path="/">
            <Redirect to="/main" />
          </Route>
        </Switch>
      </ThemeProvider>
    </div>
  );
};

const ThemedApp: React.FC = () => {
  // ThemedManager must be declared and instantiated before useTheme() is called
  return (
    <ThemeManager>
      <Router>
        <App />
      </Router>
    </ThemeManager>
  );
};

export default hot(ThemedApp);
