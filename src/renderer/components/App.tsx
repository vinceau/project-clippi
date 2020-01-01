import * as React from "react";

import { HashRouter as Router } from "react-router-dom";

import { useSelector } from "react-redux";

import { sp } from "@/lib/sounds";
import { iRootState } from "@/store";

import { Main } from "./Main";
import { updateEventActionManager } from "@/lib/actions";

export const App: React.FC = () => {
    // Initialize things that need initializing
    const events = useSelector((state: iRootState) => state.slippi.events);
    const soundFiles = useSelector((state: iRootState) => state.filesystem.soundFiles);
    sp.deserialize(soundFiles);
    updateEventActionManager(events);

    return (
        <Router>
            <Main />
        </Router>
    );
};
