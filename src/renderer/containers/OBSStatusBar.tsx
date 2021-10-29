import styled from "@emotion/styled";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";

import { ConnectionStatusDisplay } from "@/components/ConnectionStatusDisplay";
import { Labelled } from "@/components/Labelled";
import { RecordButton } from "@/components/RecordButton";
import { dolphinRecorder, loadQueueIntoDolphin } from "@/lib/dolphin";
import { OBSConnectionStatus, OBSRecordingStatus } from "@/lib/obs";
import type { Dispatch, iRootState } from "@/store";
import obsLogo from "@/styles/images/obs.png";

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

const Outer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StopButton = styled(Button)`
  &&&:hover {
    background-color: #d01919;
    color: white;
  }
`;

export const OBSStatusBar: React.FC = () => {
  const history = useHistory();
  const autoNameRecordedFiles = useSelector((state: iRootState) => state.appContainer.autoNameRecordedFiles);
  const recordSeparateClips = useSelector((state: iRootState) => state.filesystem.recordSeparateClips);
  const obsConnectionStatus = useSelector((state: iRootState) => state.tempContainer.obsConnectionStatus);
  const obsRecordingStatus = useSelector((state: iRootState) => state.tempContainer.obsRecordingStatus);
  const dolphinQueue = useSelector((state: iRootState) => state.tempContainer.dolphinQueue);
  const dolphinPlaybackFile = useSelector((state: iRootState) => state.tempContainer.dolphinPlaybackFile);
  const dolphinRunning = useSelector((state: iRootState) => state.tempContainer.dolphinRunning);

  const dispatch = useDispatch<Dispatch>();

  const recordValue = recordSeparateClips ? RecordingMethod.SEPARATE : RecordingMethod.TOGETHER;
  const recordButtonText = recordSeparateClips ? "Record separately" : "Record together";

  const obsIsConnected = obsConnectionStatus === OBSConnectionStatus.CONNECTED;

  const onRecordChange = (value: string) => {
    dispatch.filesystem.setRecordSeparateClips(value === RecordingMethod.SEPARATE);
  };

  const onPlay = () => {
    loadQueueIntoDolphin({ record: false }).catch(console.error);
  };

  const onRecord = () => {
    loadQueueIntoDolphin({
      record: true,
      recordAsOneFile: !recordSeparateClips,
      renameOutput: autoNameRecordedFiles,
    }).catch(console.error);
  };

  const onStop = () => {
    dolphinRecorder.killDolphin();
  };

  let color = "#888888";
  if (obsIsConnected) {
    color = obsRecordingStatus === OBSRecordingStatus.STOPPED ? "#00E461" : "#F30807";
  }
  const headerText = displayOBSStatus(obsConnectionStatus, obsRecordingStatus);
  const innerText = dolphinPlaybackFile ? `Playing: ${dolphinPlaybackFile}` : "No file playing";

  const obsIsRecording = obsRecordingStatus === OBSRecordingStatus.RECORDING;
  const recordButtonDisabled = !obsIsConnected || obsIsRecording;
  const recordingButtonTitle = !obsIsConnected
    ? "Connect to OBS to enable recording"
    : obsIsRecording
    ? "Recording in progress"
    : recordValue === RecordingMethod.SEPARATE
    ? "Record each item as a separate video"
    : "Record all items together as a single video";
  const options = Object.entries(recordingOptions).map(([key, val]) => ({ ...val, value: key }));
  return (
    <Outer>
      <ConnectionStatusDisplay
        icon={obsLogo}
        iconHoverText="Open OBS settings"
        onIconClick={() => history.push("/settings/obs-settings")}
        headerText={headerText}
        shouldPulse={obsIsRecording}
        color={color}
      >
        {innerText}
      </ConnectionStatusDisplay>
      <div>
        {dolphinRunning ? (
          <StopButton type="button" onClick={onStop}>
            <Icon name="stop" />
            Stop
          </StopButton>
        ) : (
          <>
            <Labelled title={recordingButtonTitle} disabled={!recordButtonDisabled}>
              <RecordButton
                onClick={onRecord}
                disabled={recordButtonDisabled}
                onChange={onRecordChange}
                value={recordValue}
                options={options}
              >
                <Icon name="circle" />
                {recordButtonText}
              </RecordButton>
            </Labelled>
            <Button primary={true} onClick={onPlay} disabled={dolphinQueue.length === 0}>
              <Icon name="play" />
              Play
            </Button>
          </>
        )}
      </div>
    </Outer>
  );
};

export const displayOBSStatus = (
  connectionStatus: OBSConnectionStatus,
  recordingStatus: OBSRecordingStatus
): string => {
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
