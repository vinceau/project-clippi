import * as React from "react";

import { ConnectionStatus } from "@vinceau/slp-realtime";

import styled, {css} from "styled-components";
import { pulseAnimation } from "@/styles/animations";

const statusToLabel = (status: ConnectionStatus): string => {
    switch (status) {
        case ConnectionStatus.DISCONNECTED:
            return "disconnected";
        case ConnectionStatus.CONNECTING:
            return "connecting";
        case ConnectionStatus.CONNECTED:
            return "connected";
        case ConnectionStatus.RECONNECTING:
            return "reconnecting";
        default:
            return "unknown";
    }
};

const statusToColor = (status: ConnectionStatus): string => {
    switch (status) {
        case ConnectionStatus.CONNECTED:
            return "#00E461";
        case ConnectionStatus.CONNECTING:
        case ConnectionStatus.RECONNECTING:
            return "#FFB424";
        default:
            return "#F30807";
    }
};

export const ConnectionStatusDisplay: React.FC<{
    status: ConnectionStatus;
}> = props => {
    const color = statusToColor(props.status);
    const shouldPulse = props.status !== ConnectionStatus.DISCONNECTED;
    const animated = css`
    animation: ${pulseAnimation("6px", color)}
    `;
    const ScanningDot = styled.span`
        height: 10px;
        width: 10px;
        background-color: ${color};
        border-radius: 50%;
        display: inline-block;
        margin-right: 5px;
        ${shouldPulse && animated}
    `;

    return (
        <div>
            <ScanningDot /> {statusToLabel(props.status)}
        </div>
    );
};
