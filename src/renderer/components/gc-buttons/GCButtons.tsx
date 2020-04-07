import React from "react";

import { ZButton } from "./ZButton";
import { YButton } from "./YButton";
import { XButton } from "./XButton";
import { LTrigger } from "./LTrigger";

export const GCButtons: React.FC = () => {
    const [zPressed, setZPressed] = React.useState(false);
    const [xPressed, setXPressed] = React.useState(false);
    const [yPressed, setYPressed] = React.useState(false);
    const [lPressed, setLPressed] = React.useState(false);
    return (
        <div>
            <LTrigger pressed={lPressed} onClick={() => setLPressed(!lPressed)}/>
            <XButton pressed={xPressed} onClick={() => setXPressed(!xPressed)}/>
            <YButton pressed={yPressed} onClick={() => setYPressed(!yPressed)}/>
            <ZButton pressed={zPressed} onClick={() => setZPressed(!zPressed)}/>
        </div>
    );
};