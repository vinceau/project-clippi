import * as React from "react";

import { ConnectionStatus } from "@vinceau/slp-realtime";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { ConnectionStatusDisplay } from "@/components/ConnectionStatusDisplay";
import { statusToColor, statusToLabel } from "@/lib/status";
import { iRootState } from "@/store";

import slippiLogo from "@/styles/images/slippi.png";

export const StatusBar: React.FC = () => {
  const history = useHistory();

  const { port } = useSelector((state: iRootState) => state.slippi);
  const { currentSlpFolderStream, slippiConnectionStatus } = useSelector((state: iRootState) => state.tempContainer);

  const isFolderStream = Boolean(currentSlpFolderStream);
  const relayIsConnected = slippiConnectionStatus === ConnectionStatus.CONNECTED;
  const headerText = isFolderStream ? "Monitoring" : statusToLabel(slippiConnectionStatus);
  const innerText = isFolderStream ? <>{currentSlpFolderStream}</> : <>Relay Port: {port}</>;
  const connected = isFolderStream || relayIsConnected;
  const color = statusToColor(isFolderStream ? ConnectionStatus.CONNECTED : slippiConnectionStatus);
  return (
    <div>
      <ConnectionStatusDisplay
        icon={slippiLogo}
        iconHoverText="Open Slippi settings"
        onIconClick={() => history.push("/settings/slippi-settings")}
        headerText={headerText}
        shouldPulse={connected}
        color={color}
      >
        {innerText}
      </ConnectionStatusDisplay>
    </div>
  );
};
