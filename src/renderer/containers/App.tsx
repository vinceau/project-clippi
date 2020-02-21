import React from "react";

import { hot } from "react-hot-loader/root";

import { HashRouter as Router, Switch, Route, useHistory } from "react-router-dom";
import { MainView } from "@/views/main/MainView";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, useTheme, ThemeMode } from "@/styles";
import { SettingsPage } from "@/containers/Settings/Settings";


const Settings = () => {
    const history = useHistory();
    return (
        <SettingsPage showSettings={true} onClose={() => history.push("/")} />
    );
};

const App: React.FC = () => {
    const theme = useTheme();

    return (
        <ThemeProvider theme={theme.themeName === ThemeMode.LIGHT ? lightTheme : darkTheme}>
            <div>
                <button onClick={() => {
                    console.log("buton clicked");
                    theme.toggle();
                }} style={{ position: "absolute", zIndex: 99, right: 0 }}>
                    {theme.themeName === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                </button>
                <Router>
                    <Switch>
                        <Route path="/settings">
                            <Settings />
                        </Route>
                        <Route path="/">
                            <MainView />
                        </Route>
                    </Switch>
                </Router>

            </div>
        </ThemeProvider>
    );
};

export default hot(App);
