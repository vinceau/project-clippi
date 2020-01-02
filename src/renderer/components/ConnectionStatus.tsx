import * as React from "react";

import { Image, Card, Button, Header } from "semantic-ui-react";
import { ConnectionStatus } from "@vinceau/slp-realtime";

import styled, { css } from "styled-components";
import { pulseAnimation } from "@/styles/animations";

import slippiLogo from "@/styles/images/slippi.png";
import { InlineInput } from "./InlineInputs";
import { LabelledButton } from "./Misc";

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

const statusToClickLabel = (status: ConnectionStatus): string => {
    switch (status) {
        case ConnectionStatus.DISCONNECTED:
            return "Click to connect";
        case ConnectionStatus.CONNECTED:
            return "Click to disconnect";
        default:
            return "";
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

export const ScanningDot: React.FC<{
    color: string;
    shouldPulse?: boolean;
}> = props => {
    const animated = css`
    animation: ${pulseAnimation("6px", props.color)}
    `;
    const InnerScanningDot = styled.span`
        height: 10px;
        width: 10px;
        background-color: ${props.color};
        border-radius: 50%;
        display: inline-block;
        margin-right: 5px;
        ${props.shouldPulse && animated}
    `;
    return (<InnerScanningDot />);

}

export const ConnectionStatusDisplay: React.FC<{
    port: string;
    onPortChange: (port: string) => void;
    onConnectClick: () => void;
    onDisconnectClick: () => void;
    status: ConnectionStatus;
}> = props => {
    const color = statusToColor(props.status);
    const shouldPulse = props.status !== ConnectionStatus.DISCONNECTED;
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
    const handleClick = () => {
        switch (props.status) {
            case ConnectionStatus.DISCONNECTED:
                props.onConnectClick();
                return;
            case ConnectionStatus.CONNECTED:
                props.onDisconnectClick();
                return;
        }
    };

    return (
        <Outer>
            <img src={slippiLogo} style={{ height: "35px", width: "35px" }} />
            <ConnectInfo>
                <LabelledButton title={statusToClickLabel(props.status)} onClick={handleClick} position="right">
                    <Header sub>
                        <ScanningDot shouldPulse={shouldPulse} color={color} /> {statusToLabel(props.status)}
                    </Header>
                </LabelledButton>
                <span>Relay Port: <InlineInput value={props.port} onChange={props.onPortChange} /></span>
            </ConnectInfo>
        </Outer>
    );
};


const statusToButtonLabel = (status: ConnectionStatus): string => {
    switch (status) {
        case ConnectionStatus.DISCONNECTED:
            return "Connect";
        case ConnectionStatus.CONNECTED:
            return "Disconnect";
        default:
            return "Connecting...";
    }
};

export const SlippiConnectionStatusCard: React.SFC<{
    port: string;
    status: ConnectionStatus;
    onPortChange: (port: string) => void;
    onConnect: () => void;
    onDisconnect: () => void;
}> = props => {
    const userImage = slippiLogo;
    const StatusContainer = styled.div`
    padding: 3px;
    `;
    const handleButtonClick = () => {
        switch (props.status) {
            case ConnectionStatus.DISCONNECTED:
                props.onConnect();
                return;
            case ConnectionStatus.CONNECTED:
                props.onDisconnect();
                return;
        }
    };
    const color = statusToColor(props.status);
    const shouldPulse = props.status !== ConnectionStatus.DISCONNECTED;
    const StatusSpan = styled.span`
    text-transform: capitalize;
    margin-right: 5px;
    `;
    const isConnecting = props.status !== ConnectionStatus.DISCONNECTED && props.status !== ConnectionStatus.CONNECTED;
    return (
        <StatusContainer>
            <Card>
                <Card.Content>
                    <Image
                        floated="right"
                        size="mini"
                        src={userImage}
                    />
                    <Card.Header>
                        <StatusSpan>
                            {statusToLabel(props.status)}
                        </StatusSpan>
                        <ScanningDot color={color} shouldPulse={shouldPulse} />
                    </Card.Header>
                    <Card.Meta>
                        <span>Relay Port: <InlineInput value={props.port} onChange={props.onPortChange} /></span>
                    </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                    <Button basic fluid color={shouldPulse ? "red" : "green"} onClick={handleButtonClick} disabled={isConnecting}>
                        {statusToButtonLabel(props.status)}
                    </Button>
                </Card.Content>
            </Card>
        </StatusContainer>
    );
};
