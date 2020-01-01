import * as React from "react";

import { HashRouter as Router } from "react-router-dom";

import { useSelector } from "react-redux";

import { sp } from "@/lib/sounds";
import { iRootState } from "@/store";

import { Main } from "./Main";

export const App: React.FC = () => {
    // Initialize things that need initializing
    const soundFiles = useSelector((state: iRootState) => state.filesystem.soundFiles);
    sp.deserialize(soundFiles);

    return (
        <Router>
            <Main />
        </Router>
    );
};
