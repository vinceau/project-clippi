import React from "react";

import { ZButton } from "./ZButton";
import { YButton } from "./YButton";
import { XButton } from "./XButton";
import { LTrigger } from "./LTrigger";
import { RTrigger } from "./RTrigger";
import { DLeft } from "./DLeft";

export const GCButtons: React.FC = () => {
    const [zPressed, setZPressed] = React.useState(false);
    const [xPressed, setXPressed] = React.useState(false);
    const [yPressed, setYPressed] = React.useState(false);
    const [lPressed, setLPressed] = React.useState(false);
    const [rPressed, setRPressed] = React.useState(false);
    const [dlPressed, setDLPressed] = React.useState(false);
    return (
        <div>
            <DLeft pressed={dlPressed} onClick={setDLPressed}/>
            <LTrigger pressed={lPressed} onClick={setLPressed}/>
            <RTrigger pressed={rPressed} onClick={setRPressed}/>
            <XButton pressed={xPressed} onClick={setXPressed}/>
            <YButton pressed={yPressed} onClick={setYPressed}/>
            <ZButton pressed={zPressed} onClick={setZPressed}/>
        </div>
    );
};