import * as React from "react";

import styled, { css } from "styled-components";

import { Tooltip } from "react-tippy";

import { isDevelopment } from "@/lib/utils";
import { eventActionManager } from "@/actions";
import { ActionEvent } from "@/lib/realtime";
import { notify } from "../lib/utils";
import { setScene, connectToOBS } from "@/lib/obs";

export const DevTools = () => {
    const handleClick = () => {
        console.log("notify clicked");
        notify("Here's a notification", "A notification title");
    };
    const customEvent = () => {
        eventActionManager.emitEvent(ActionEvent.TEST_EVENT).catch(console.error);
    };
    const [sceneName, setSceneName] = React.useState("");
    return (
        <div>
            <input value={sceneName} onChange={(e) => setSceneName(e.target.value)} />
            <button onClick={() => setScene(sceneName).catch(console.error)}>change obs scene</button>
            <button onClick={() => connectToOBS().catch(console.error)}>connect to obs</button>
            <button onClick={handleClick}>notify</button>
            <button onClick={customEvent}>trigger test event</button>
        </div>
    );
};

export const Labelled = (props: any) => {
    const { onClick, children, ...rest } = props;
    const pointerStyle = {
        cursor: "pointer",
    };
    return (
        <span style={onClick ? pointerStyle : undefined} onClick={onClick}>
            <Tooltip arrow={true} duration={200} position="bottom" style={{ display: "inline-block" }} {...rest}>
                {children}
            </Tooltip>
        </span>
    );
};

export const CustomIcon: React.FC<{
    image: string;
    color: string;
    size?: number;
}> = (props) => {
    const size = (s: number) => css`
    height: ${s}px !important;
    width: ${s}px !important;
    `;
    const Outer = styled.i`
    &&& {
        ${props.size && size(props.size)}
        &::before {
            content: "";
            mask: url("${props.image}") no-repeat 100% 100%;
            mask-size: contain;
            background-color: ${props.color} !important;
            height: 100%;
            width: 100%;
            display: block;
        }
    }
    `;
    return (
        <Outer aria-hidden="true" className="icon" />
    );
};

export const CodeBlock: React.FC<{
    values: any
}> = (props) => {
    if (isDevelopment) {
        return (<pre>{(JSON as any).stringify(props.values, 0, 2)}</pre>);
    }
    return null;
};