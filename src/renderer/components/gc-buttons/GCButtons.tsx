import React from "react";

import { ZButton } from "./ZButton";

export const GCButtons: React.FC = () => {
    const [zPressed, setZPressed] = React.useState(false);
    return (
        <div>
<ZButton pressed={zPressed} onClick={() => setZPressed(!zPressed)}/>
<svg width="240px" height="70px" viewBox="0 0 240 70" version="1.1">
    <g id="Page-1" stroke="green" strokeWidth="10" fill="none" fillRule="evenodd">
        <g id="ButtonIcon-GCN-Z" fill="#6F1FFF" fillRule="nonzero">
            <rect id="rect3350" x="0" y="0" width="240" height="70" rx="35" />
        </g>
    </g>
</svg>
        </div>
    );
}