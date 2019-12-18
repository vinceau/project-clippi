import * as React from "react";

import { HashRouter as Router } from "react-router-dom";

// import { Main } from "./Main";
import { Panel } from "./Panel";

export const App: React.FC = () => {
    return (
        <Router>
            <Panel />
        </Router>
    );
};
