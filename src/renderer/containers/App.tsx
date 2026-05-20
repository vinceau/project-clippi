// Import all the styles first since they will be overwritten
import "@/styles/index.scss"; // Our custom styles
import "@/styles/animations.css"; // Keyframe animations

import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

import { History } from "@/components/History";
import { checkForNewUpdates } from "@/lib/utils";
import type { Dispatch, iRootState } from "@/store";
import { persistor, store } from "@/store";
import { ThemeManager, ThemeMode, useTheme } from "@/styles";
import { MainView, SettingsView } from "@/views";
import { ToastProvider } from "@/ui/Toast/Toast";
import { TooltipProvider } from "@/ui/Tooltip/Tooltip";

function App() {
  const dispatch = useDispatch<Dispatch>();
  const { reconnectTwitch } = useSelector((state: iRootState) => state.twitch);
  const theme = useTheme();
  React.useEffect(() => {
    checkForNewUpdates();
    if (reconnectTwitch) {
      dispatch.tempContainer.authenticateTwitch();
    }
  }, []);
  return (
    <ToastProvider>
      <TooltipProvider>
        <div className={theme.themeName}>
          <History />
          <Switch>
            <Route path="/main" component={MainView} />
            <Route path="/settings" component={SettingsView} />
            <Route exact path="/">
              <Redirect to="/main" />
            </Route>
          </Switch>
        </div>
      </TooltipProvider>
    </ToastProvider>
  );
}

function AppWithProviders() {
  // ThemedManager must be declared and instantiated before useTheme() is called
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeManager>
          <Router>
            <App />
          </Router>
        </ThemeManager>
      </PersistGate>
    </Provider>
  );
}

// eslint-disable-next-line import/no-default-export
export default AppWithProviders;
