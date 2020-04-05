import * as React from "react";

import { useSelector } from "react-redux";

import { ConnectionStatusDisplay } from "@/components/ConnectionStatusDisplay";
import { iRootState } from "@/store";
import { OBSConnectionStatus, OBSRecordingStatus } from "@/lib/obs";
import { Icon, Button, Dropdown } from "semantic-ui-react";

import styled from "styled-components";
import obsLogo from "@/styles/images/obs.png";

const options = [
    { key: 'together', icon: 'file video outline', text: 'Together as one video', value: 'together' },
    { key: 'seperate', icon: 'film', text: 'Seperate clips', value: 'separate' },
]

const RecordButton: React.FC<{
    disabled?: boolean;
}> = (props) => {
    const onChange = (value: any) => {
        console.log(value);
    }
    return (
        <Button.Group>
            <Button disabled={props.disabled}><Icon name="circle" /> Record together</Button>
            <Dropdown
                disabled={props.disabled}
                className="button icon"
                floating
                onChange={(_: any, { value }) => onChange(value)}
                options={options}
                trigger={<React.Fragment />}
            />
        </Button.Group>
    );
};


const Outer = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

export const OBSStatusBar: React.FC = () => {
    const { obsConnectionStatus, obsRecordingStatus } = useSelector((state: iRootState) => state.tempContainer);

    const handleClick = () => {
        /*
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
        */
    };
    const hoverText = "abc"; // isFolderStream ? "Stop monitoring" : relayIsConnected ? "Click to disconnect" : "Click to connect";
    const headerText = displayOBSStatus(obsConnectionStatus, obsRecordingStatus); // isFolderStream ? "Monitoring" : statusToLabel(slippiConnectionStatus);
    const innerText = "ghi"; // isFolderStream ? <>{currentSlpFolderStream}</> :
    // <>Relay Port: <InlineInput value={port} onChange={dispatch.slippi.setPort} /></>;
    // const connected = isFolderStream || relayIsConnected;
    let color = "#888888";

    if (obsConnectionStatus === OBSConnectionStatus.CONNECTED) {
        color = obsRecordingStatus === OBSRecordingStatus.STOPPED ? "#00E461" : "#F30807";
    }

    return (
        <Outer>
            <ConnectionStatusDisplay
                icon={obsLogo}
                headerText={headerText}
                headerHoverTitle={hoverText}
                onHeaderClick={handleClick}
                shouldPulse={obsRecordingStatus === OBSRecordingStatus.RECORDING}
                color={color}
            >
                {innerText}
            </ConnectionStatusDisplay>
            <div>
                <RecordButton />
                <Button><Icon name="play" />Play</Button>
            </div>
        </Outer>
    );
};

export const displayOBSStatus = (connectionStatus: OBSConnectionStatus, recordingStatus: OBSRecordingStatus): string => {
    if (connectionStatus === OBSConnectionStatus.DISCONNECTED) {
        return "Disconnected";
    }

    switch (recordingStatus) {
        case OBSRecordingStatus.RECORDING:
            return "Recording";
        case OBSRecordingStatus.PAUSED:
            return "Paused";
        default:
            return "Ready";
    }
};
