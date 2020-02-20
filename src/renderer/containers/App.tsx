import * as React from "react";

import { HashRouter as Router } from "react-router-dom";
import { MainView } from "@/views/main/MainView";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "@/styles/theme";

export const App: React.FC = () => {
    const [theme, setTheme] = React.useState("light");
    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    return (
        <ThemeProvider theme={theme === "dark" ? lightTheme : darkTheme}>
            <Router>
                <MainView />
            </Router>
        </ThemeProvider>
    );
};
