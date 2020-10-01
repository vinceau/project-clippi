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

  const port = useSelector((state: iRootState) => state.slippi.port);
  const slippiConnectionStatus = useSelector((state: iRootState) => state.tempContainer.slippiConnectionStatus);
  const slippiConnectionType = useSelector((state: iRootState) => state.tempContainer.slippiConnectionType);

  const connected = slippiConnectionStatus === ConnectionStatus.CONNECTED;
  const isDolphinConnection = connected && slippiConnectionType === "dolphin";
  const headerText = statusToLabel(slippiConnectionStatus);
  const innerText = isDolphinConnection ? "Slippi Dolphin" : `Relay Port: ${port}`;
  const color = statusToColor(slippiConnectionStatus);
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
