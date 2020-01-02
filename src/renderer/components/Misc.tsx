import * as React from "react";

import styled, { css } from "styled-components";

import { Tooltip } from "react-tippy";

import { eventActionManager } from "@/lib/actions";
import { ActionEvent } from "@/lib/realtime";
import { notify } from "../lib/utils";

export const DevTools = () => {
    const handleClick = () => {
        console.log("notify clicked");
        notify("Notification title", "Notification body");
    };
    const customEvent = () => {
        eventActionManager.emitEvent(ActionEvent.TEST_EVENT).catch(console.error);
    };
    return (
        <div>
            <button onClick={handleClick}>notify</button>
            <button onClick={customEvent}>trigger test event</button>
        </div>
    );
};

export const LabelledButton = (props: any) => {
    const { onClick, children, ...rest } = props;
    const Outer = styled.span`
    cursor: pointer;
    `;
    return (
        <Outer onClick={props.onClick}>
            <Tooltip arrow={true} duration={200} position="bottom" style={{ display: "inline-block" }} {...rest}>
                {props.children}
            </Tooltip>
        </Outer>
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
