import * as React from "react";

import { HashRouter as Router } from "react-router-dom";
import { MainView } from "@/views/main/MainView";

export const App: React.FC = () => {
    return (
        <Router>
            <MainView />
        </Router>
    );
};
