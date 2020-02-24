import React from "react";

import { hot } from "react-hot-loader/root";

import { HashRouter as Router, Switch, Route, useHistory, Redirect } from "react-router-dom";
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
                <Router>
                    <Switch>
                        <Route path="/main" component={MainView} />
                        <Route path="/settings" component={Settings} />
                        <Route exact path="/">
                            <Redirect to="/main" />
                        </Route>
                    </Switch>
                </Router>

            </div>
        </ThemeProvider>
    );
};

export default hot(App);
