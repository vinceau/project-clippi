import React from "react";

import { ZButton } from "./ZButton";
import { YButton } from "./YButton";
import { XButton } from "./XButton";
import { AButton } from "./AButton";
import { BButton } from "./BButton";
import { LTrigger } from "./LTrigger";
import { RTrigger } from "./RTrigger";
import { DLeft } from "./DLeft";
import { DRight } from "./DRight";
import { DUp } from "./DUp";
import { DDown } from "./DDown";

export const GCButtons: React.FC = () => {
    const [zPressed, setZPressed] = React.useState(false);
    const [xPressed, setXPressed] = React.useState(false);
    const [yPressed, setYPressed] = React.useState(false);
    const [lPressed, setLPressed] = React.useState(false);
    const [rPressed, setRPressed] = React.useState(false);
    const [dlPressed, setDLPressed] = React.useState(false);
    const [drPressed, setDRPressed] = React.useState(false);
    const [duPressed, setDUPressed] = React.useState(false);
    const [ddPressed, setDDPressed] = React.useState(false);
    const [aPressed, setAPressed] = React.useState(false);
    const [bPressed, setBPressed] = React.useState(false);
    return (
        <div>
            <BButton pressed={bPressed} onClick={setBPressed}/>
            <AButton pressed={aPressed} onClick={setAPressed}/>
            <DDown pressed={ddPressed} onClick={setDDPressed}/>
            <DUp pressed={duPressed} onClick={setDUPressed}/>
            <DRight pressed={drPressed} onClick={setDRPressed}/>
            <DLeft pressed={dlPressed} onClick={setDLPressed}/>
            <LTrigger pressed={lPressed} onClick={setLPressed}/>
            <RTrigger pressed={rPressed} onClick={setRPressed}/>
            <XButton pressed={xPressed} onClick={setXPressed}/>
            <YButton pressed={yPressed} onClick={setYPressed}/>
            <ZButton pressed={zPressed} onClick={setZPressed}/>
        </div>
    );
};