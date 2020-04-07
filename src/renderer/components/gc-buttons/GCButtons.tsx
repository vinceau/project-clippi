import React from "react";

import { ZButton } from "./ZButton";
import { YButton } from "./YButton";
import { XButton } from "./XButton";

export const GCButtons: React.FC = () => {
    const [zPressed, setZPressed] = React.useState(false);
    const [xPressed, setXPressed] = React.useState(false);
    const [yPressed, setYPressed] = React.useState(false);
    return (
        <div>
            <XButton pressed={xPressed} onClick={() => setXPressed(!xPressed)}/>
            <YButton pressed={yPressed} onClick={() => setYPressed(!yPressed)}/>
            <ZButton pressed={zPressed} onClick={() => setZPressed(!zPressed)}/>
        </div>
    );
};