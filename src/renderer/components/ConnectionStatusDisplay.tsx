import * as React from "react";

import styled from "styled-components";

import { Header } from "semantic-ui-react";

import { Labelled } from "@/components/Labelled";

import { ScanningDot } from "@/components/ScanningDot";
import slippiLogo from "@/styles/images/slippi.png";

export const ConnectionStatusDisplay: React.FC<{
    headerText: string;
    headerHoverTitle: string;
    onHeaderClick?: () => void;
    color?: string;
    shouldPulse?: boolean;
}> = props => {
    const Outer = styled.div`
    padding: 10px 0;
    display: flex;
    `;
    const ConnectInfo = styled.div`
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    `;
    return (
        <Outer>
            <img src={slippiLogo} style={{ height: "35px", width: "35px" }} />
            <ConnectInfo>
                <Labelled title={props.headerHoverTitle} onClick={props.onHeaderClick} position="right">
                    <Header sub>
                        <ScanningDot shouldPulse={props.shouldPulse} color={props.color || "red"} /> {props.headerText}
                    </Header>
                </Labelled>
                {props.children && <span>{props.children}</span>}
            </ConnectInfo>
        </Outer>
    );
};
