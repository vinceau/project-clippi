import * as React from "react";

import { ConnectionStatusDisplay } from "@/components/ConnectionStatusDisplay";
import { loadQueueIntoDolphin } from "@/lib/dolphin";
import { OBSConnectionStatus, OBSRecordingStatus } from "@/lib/obs";
import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon } from "semantic-ui-react";

import { RecordButton } from "@/components/recorder/RecordButton";
import obsLogo from "@/styles/images/obs.png";
import styled from "styled-components";

enum RecordingMethod {
    TOGETHER = "together",
    SEPARATE = "separate",
}

const recordingOptions = [
    { icon: "file video outline", text: "Together as one video", value: RecordingMethod.TOGETHER },
    { icon: "film", text: "Seperate clips", value: RecordingMethod.SEPARATE },
];

const Outer = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

export const OBSStatusBar: React.FC = () => {
    const { recordSeparateClips } = useSelector((state: iRootState) => state.filesystem);
    const { obsConnectionStatus, obsRecordingStatus, dolphinQueue, dolphinPlaybackFile } = useSelector((state: iRootState) => state.tempContainer);
    const dispatch = useDispatch<Dispatch>();

    const recordValue = recordSeparateClips ? RecordingMethod.SEPARATE : RecordingMethod.TOGETHER;
    const recordButtonText = recordSeparateClips ? "Record separately" : "Record together";

    const onRecordChange = (value: string) => {
        dispatch.filesystem.setRecordSeparateClips(value === RecordingMethod.SEPARATE);
    };

    const onPlay = () => {
        loadQueueIntoDolphin({ record: false });
    };

    const onRecord = () => {
        loadQueueIntoDolphin({ record: true, pauseBetweenEntries: !recordSeparateClips });
    };

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
    const innerText = dolphinPlaybackFile ? dolphinPlaybackFile : "No file playing"; // isFolderStream ? <>{currentSlpFolderStream}</> :
    // <>Relay Port: <InlineInput value={port} onChange={dispatch.slippi.setPort} /></>;
    // const connected = isFolderStream || relayIsConnected;
    let color = "#888888";

    const obsIsConnected = obsConnectionStatus === OBSConnectionStatus.CONNECTED;
    if (obsIsConnected) {
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
                <RecordButton
                    onClick={onRecord}
                    disabled={!obsIsConnected}
                    onChange={onRecordChange}
                    value={recordValue}
                    options={recordingOptions}
                >
                    <Icon name="circle" />{recordButtonText}
                </RecordButton>
                <Button onClick={onPlay} style={{marginLeft: "0.25em"}} disabled={dolphinQueue.length === 0}><Icon name="play" />Play</Button>
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
