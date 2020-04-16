import * as React from "react";

import { ConnectionStatus } from "@vinceau/slp-realtime";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { ConnectionStatusDisplay } from "@/components/ConnectionStatusDisplay";
import { InlineInput } from "@/components/InlineInputs";
import { streamManager } from "@/lib/realtime";
import { statusToColor, statusToLabel } from "@/lib/status";
import { Dispatch, iRootState } from "@/store";

import slippiLogo from "@/styles/images/slippi.png";

export const StatusBar: React.FC = () => {
    const history = useHistory();

    const { port } = useSelector((state: iRootState) => state.slippi);
    const { currentSlpFolderStream, slippiConnectionStatus } = useSelector((state: iRootState) => state.tempContainer);
    const dispatch = useDispatch<Dispatch>();

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
        <div>
            <ConnectionStatusDisplay
                icon={slippiLogo}
                iconHoverText="Open Slippi settings"
                onIconClick={() => history.push("/settings/slippi-settings")}
                headerText={headerText}
                headerHoverTitle={hoverText}
                onHeaderClick={handleClick}
                shouldPulse={connected}
                color={color}
            >
                {innerText}
            </ConnectionStatusDisplay>
        </div>
    );
};
