import React from "react";

import { ZButton } from "./ZButton";
import { YButton } from "./YButton";

export const GCButtons: React.FC = () => {
    const [zPressed, setZPressed] = React.useState(false);
    const [yPressed, setYPressed] = React.useState(false);
    return (
        <div>
            <YButton pressed={yPressed} onClick={() => setYPressed(!yPressed)}/>
            <ZButton pressed={zPressed} onClick={() => setZPressed(!zPressed)}/>
        </div>
    );
};