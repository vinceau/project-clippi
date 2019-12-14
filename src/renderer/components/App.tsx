import * as React from "react";

import { stages as stageUtils } from "slp-parser-js";

export const App: React.FC = () => {
    const stageName = stageUtils.getStageName(2);
    return (
        <div>I am an app. Best stage: {stageName}</div>
    );
};
