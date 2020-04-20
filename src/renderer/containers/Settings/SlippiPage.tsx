import * as React from "react";

import { ConnectionStatus } from "@vinceau/slp-realtime";
import { useDispatch, useSelector } from "react-redux";

import { ConnectionStatusCard } from "@/components/ConnectionStatusCard";
import { streamManager } from "@/lib/realtime";
import { statusToColor, statusToLabel } from "@/lib/status";
import { Dispatch, iRootState } from "@/store";
import { SlippiConnectionPlaceholder } from "../SlippiConnectionPlaceholder";

import slippiLogo from "@/styles/images/slippi.png";
import { PageHeader, FormContainer } from "@/components/Form";

export const SlippiPage: React.FC = () => {
    const { port } = useSelector((state: iRootState) => state.slippi);
    const { slippiConnectionStatus, currentSlpFolderStream } = useSelector((state: iRootState) => state.tempContainer);
    const dispatch = useDispatch<Dispatch>();
    const relayConnected = slippiConnectionStatus === ConnectionStatus.CONNECTED;
    const isFolderStream = currentSlpFolderStream !== "";
    const connected = relayConnected || isFolderStream;
    const buttonText = isFolderStream ? "Stop monitoring" : "Disconnect";

    const onDisconnect = () => {
        if (relayConnected) {
            streamManager.disconnectFromSlippi();
            return;
        }
        streamManager.stopMonitoringSlpFolder();
    };
    const status = isFolderStream ? ConnectionStatus.CONNECTED : slippiConnectionStatus;
    const header = isFolderStream ? "Monitoring" : statusToLabel(status);
    const subHeader = isFolderStream ? currentSlpFolderStream : `Relay Port: ${port}`;
    const statusColor = statusToColor(status);
    return (
        <div>
            <PageHeader>Slippi Connection</PageHeader>
            {connected ?
                <ConnectionStatusCard
                    header={header}
                    subHeader={subHeader}
                    userImage={slippiLogo}
                    statusColor={statusColor}
                    shouldPulse={connected}
                    onDisconnect={onDisconnect}
                    buttonText={buttonText}
                />
                :
                <SlippiConnectionPlaceholder
                    port={port}
                    onClick={dispatch.slippi.connectToSlippi}
                />
            }
        </div>
    );
};
