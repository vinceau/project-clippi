import * as React from "react";

import styled, { css } from "styled-components";

import { ConnectionStatus } from "@vinceau/slp-realtime";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Divider, Grid, Header, Image, Input, Segment } from "semantic-ui-react";

import { streamManager } from "@/lib/realtime";
import { Dispatch, dispatcher, iRootState } from "@/store";
import { pulseAnimation } from "@/styles/animations";
import { CustomIcon, Labelled } from "./Misc";
import { device } from "@/styles/device";

import dolphinLogoSVG from "@/styles/images/dolphin.svg";
import slippiLogoSVG from "@/styles/images/slippi-logo.svg";
import slippiLogo from "@/styles/images/slippi.png";

export const statusToLabel = (status: ConnectionStatus): string => {
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

export const statusToColor = (status: ConnectionStatus): string => {
    switch (status) {
        case ConnectionStatus.DISCONNECTED:
            return "#F30807";
        case ConnectionStatus.CONNECTING:
        case ConnectionStatus.RECONNECTING:
            return "#FFB424";
        default:
            return "#00E461";
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

};

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

export const ConnectionStatusCard: React.FC<{
    userImage: any;
    header: string;
    subHeader: string;
    statusColor?: string;
    shouldPulse?: boolean;
    onDisconnect?: () => void;
    buttonText?: string;
}> = props => {
    const handleButtonClick = () => {
        if (props.onDisconnect) {
            props.onDisconnect();
        }
    };
    const color = props.statusColor || "red";
    const StatusSpan = styled.span`
    text-transform: capitalize;
    margin-right: 10px;
    `;
    return (
        <div style={{ padding: "3px" }}>
            <Card>
                <Card.Content>
                    <Image
                        floated="right"
                        size="mini"
                        src={props.userImage}
                    />
                    <Card.Header>
                        <StatusSpan>
                            {props.header}
                        </StatusSpan>
                        <ScanningDot color={color} shouldPulse={props.shouldPulse} />
                    </Card.Header>
                    <Card.Meta>
                        <span>{props.subHeader}</span>
                    </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                    <Button basic fluid color="red" onClick={handleButtonClick}>
                        {props.buttonText || "Disconnect"}
                    </Button>
                </Card.Content>
            </Card>
        </div>
    );
};

export const SlippiConnectionPlaceholder: React.FC<{
    port: string;
    onClick: (port: string) => void;
}> = props => {
    const { liveSlpFilesPath } = useSelector((state: iRootState) => state.filesystem);
    const dispatch = useDispatch<Dispatch>();
    const selectPath = () => {
        dispatch.filesystem.getLiveSlpFilesPath();
    };
    const [p, setP] = React.useState(props.port);
    const VerticalHeader = styled(Header)`
    &&& {
    display: flex;
    flex-direction: column;
    }
    `;
    const FolderInput = styled.div`
    &&& {
        display: flex;
        flex-direction: column;
        padding: 0 10px;
        @media ${device.laptop} {
            flex-direction: row;
            padding: 0 30px;
        }
    }
    `;
    const ButtonContainer = styled.div`
    &&& {
        margin-top: 5px;
        margin-left: 0px;
        @media ${device.laptop} {
            margin-top: 0px;
            margin-left: 5px;
        }
    }
    `;
    return (
        <Segment placeholder>
            <Grid columns={2} stackable textAlign="center">
                <Divider vertical>Or</Divider>
                <Grid.Row verticalAlign="middle">
                    <Grid.Column>
                        <VerticalHeader icon>
                            <CustomIcon image={slippiLogoSVG} size={54} color="#353636" />
                            Connect to a Slippi Relay
                        </VerticalHeader>
                        <Input
                            style={{ maxWidth: "150px", width: "100%" }}
                            placeholder="Port"
                            value={p}
                            onChange={(_: any, { value }: any) => setP(value)}
                            onBlur={() => dispatcher.slippi.setPort(p)}
                        />
                        <div style={{ padding: "10px 0" }}>
                            <Button primary onClick={() => props.onClick(p)}>Connect</Button>
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <VerticalHeader icon>
                            <CustomIcon image={dolphinLogoSVG} size={54} color="#353636" />
                            Monitor for SLP file changes
                        </VerticalHeader>
                        <FolderInput>
                            <Input
                                style={{ width: "100%" }}
                                placeholder="Choose a folder..."
                                value={liveSlpFilesPath}
                            />
                            <ButtonContainer>
                                <Button onClick={selectPath}>Choose</Button>
                            </ButtonContainer>
                        </FolderInput>
                        <div style={{ padding: "10px 0" }}>
                            <Button
                                primary={true}
                                disabled={!liveSlpFilesPath}
                                onClick={() => streamManager.monitorSlpFolder(liveSlpFilesPath)}
                            >
                                Start monitoring
                            </Button>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};
