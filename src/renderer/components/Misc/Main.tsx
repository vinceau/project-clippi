import * as React from "react";
import styled from "styled-components";

import { Container, Icon } from "semantic-ui-react";

import { streamManager } from "@/lib/realtime";
import { isDevelopment } from "@/lib/utils";
import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Automator } from "../Automator/Automator";
import { SettingsPage } from "../Settings/Settings";
import { ConnectionStatusDisplay, statusToLabel, statusToColor } from "./ConnectionStatus";
import { DevTools, Labelled } from "./Misc";
import { InlineInput } from "./InlineInputs";
import { ConnectionStatus } from "@vinceau/slp-realtime";

const Header: React.FC<{
    showSettings?: boolean;
    onSettingsButtonClick: () => void;
}> = (props) => {
    const { port } = useSelector((state: iRootState) => state.slippi);
    const { currentSlpFolderStream, slippiConnectionStatus } = useSelector((state: iRootState) => state.tempContainer);
    const dispatch = useDispatch<Dispatch>();

    const HeaderContainer = styled.header`
        flex: 0 1 auto;
        background-color: #F9FAFB;
        border-bottom: 1px solid #d4d4d5;
    `;
    const Inner = styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    const isFolderStream = Boolean(currentSlpFolderStream);
    const relayIsConnected = slippiConnectionStatus === ConnectionStatus.CONNECTED;
    const handleClick = () => {
        if (isFolderStream) {
            // We should disconnect from the folder stream
            streamManager.stopMonitoringSlpFolder();
            return;
        }
        if (relayIsConnected) {
            // We should disconnect from the Slippi relay
            streamManager.disconnectFromSlippi();
            return;
        }
        // Otherwise we should connect to the port
        dispatch.slippi.connectToSlippi(port);
    };
    const hoverText = isFolderStream ? "Stop monitoring" : relayIsConnected ? "Click to disconnect" : "Click to connect";
    const headerText = isFolderStream ? "Monitoring" : statusToLabel(slippiConnectionStatus);
    const innerText = isFolderStream ? <>{currentSlpFolderStream}</> :
        <>Relay Port: <InlineInput value={port} onChange={dispatch.slippi.setPort} /></>;
    const connected = isFolderStream || relayIsConnected;
    const color = statusToColor(isFolderStream ? ConnectionStatus.CONNECTED : slippiConnectionStatus);
    return (
        <HeaderContainer>
            <Container>
                <Inner>
                    <div>
                        <ConnectionStatusDisplay
                            headerText={headerText}
                            headerHoverTitle={hoverText}
                            onHeaderClick={handleClick}
                            shouldPulse={connected}
                            color={color}
                        >
                            {innerText}
                        </ConnectionStatusDisplay>
                    </div>
                    <Labelled onClick={props.onSettingsButtonClick} title="Settings">
                        <Icon name="cog" size="big" />
                    </Labelled>
                </Inner>
            </Container>
        </HeaderContainer>
    );
};

export const Main: React.FC<{}> = () => {
    // const { slippiConnectionStatus } = useSelector((state: iRootState) => state.tempContainer);
    // const dispatch = useDispatch<Dispatch>();

    const [showSettings, setShowSettings] = React.useState(false);
    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };
    const Outer = styled.div`
        display: flex;
        flex-flow: column;
        height: 100%;
    `;
    const MainSection = styled.main`
        display: flex;
        flex-flow: column;
        flex: 1 1 auto;
        overflow-y: auto;
        padding-bottom: 50px;
    `;
    return (
        <Outer>
            <SettingsPage onClose={() => setShowSettings(false)} showSettings={showSettings} />
            <Header showSettings={showSettings} onSettingsButtonClick={() => {
                toggleSettings();
            }} />
            <MainSection>
                {isDevelopment && <DevTools />}
                <Automator />
            </MainSection>
        </Outer>
    );
};
