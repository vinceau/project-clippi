import * as React from "react";

import { ConnectionStatusDisplay } from "@/components/ConnectionStatusDisplay";
import { loadQueueIntoDolphin } from "@/lib/dolphin";
import { OBSConnectionStatus, OBSRecordingStatus } from "@/lib/obs";
import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";

import { Labelled } from "@/components/Labelled";
import { RecordButton } from "@/components/recorder/RecordButton";
import obsLogo from "@/styles/images/obs.png";
import styled from "styled-components";

enum RecordingMethod {
    TOGETHER = "together",
    SEPARATE = "separate",
}

const recordingOptions = {
    [RecordingMethod.TOGETHER]: {
        title: "Record all items together as a single video",
        icon: "file video outline",
        text: "Together as one video",
    },
    [RecordingMethod.SEPARATE]: {
        title: "Record each item as a separate video",
        icon: "film",
        text: "Seperate clips",
    },
};

const Outer = styled.div<{
    isDev: boolean;
}>`
display: flex;
flex-grow: 1;
flex-direction: row;
justify-content: ${({isDev}) => isDev ? "space-between" : "flex-end"};
align-items: center;
`;

export const OBSStatusBar: React.FC = () => {
    const history = useHistory();
    const { recordSeparateClips } = useSelector((state: iRootState) => state.filesystem);
    const { isDev } = useSelector((state: iRootState) => state.slippi);
    const { obsConnectionStatus, obsRecordingStatus, dolphinQueue, dolphinPlaybackFile } = useSelector((state: iRootState) => state.tempContainer);
    const dispatch = useDispatch<Dispatch>();

    const recordValue = recordSeparateClips ? RecordingMethod.SEPARATE : RecordingMethod.TOGETHER;
    const recordButtonText = recordSeparateClips ? "Record separately" : "Record together";

    const obsIsConnected = obsConnectionStatus === OBSConnectionStatus.CONNECTED;

    const onRecordChange = (value: string) => {
        dispatch.filesystem.setRecordSeparateClips(value === RecordingMethod.SEPARATE);
    };

    const onPlay = () => {
        loadQueueIntoDolphin({ record: false });
    };

    const onRecord = () => {
        loadQueueIntoDolphin({
            record: true,
            recordAsOneFile: !recordSeparateClips,
        });
    };

    let color = "#888888";
    if (obsIsConnected) {
        color = obsRecordingStatus === OBSRecordingStatus.STOPPED ? "#00E461" : "#F30807";
    }
    const headerText = displayOBSStatus(obsConnectionStatus, obsRecordingStatus);
    const innerText = dolphinPlaybackFile ? dolphinPlaybackFile : "No file playing";

    const obsIsRecording = obsRecordingStatus === OBSRecordingStatus.RECORDING;
    const recordButtonDisabled = !obsIsConnected || obsIsRecording;
    const recordingButtonTitle = !obsIsConnected ? "Connect to OBS to enable recording" :
        obsIsRecording ? "Recording in progress" :
        recordValue === RecordingMethod.SEPARATE ? "Record each item as a separate video" : "Record all items together as a single video";
    const options = Object.entries(recordingOptions).map(([key, val]) => ({...val, value: key}));
    return (
        <Outer isDev={isDev}>
            {isDev && <ConnectionStatusDisplay
                icon={obsLogo}
                iconHoverText="Open OBS settings"
                onIconClick={() => history.push("/settings/obs-settings")}
                headerText={headerText}
                shouldPulse={obsIsRecording}
                color={color}
            >
                {innerText}
            </ConnectionStatusDisplay>}
            <div>
                {isDev && <Labelled title={recordingButtonTitle} disabled={!recordButtonDisabled}>
                    <RecordButton
                        onClick={onRecord}
                        disabled={recordButtonDisabled}
                        onChange={onRecordChange}
                        value={recordValue}
                        options={options}
                    >
                        <Icon name="circle" />{recordButtonText}
                    </RecordButton>
                </Labelled>}
                <Button primary={true} onClick={onPlay} disabled={dolphinQueue.length === 0}><Icon name="play" />Play</Button>
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
