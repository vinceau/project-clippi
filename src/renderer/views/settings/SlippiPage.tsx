import * as React from "react";

import { ConnectionStatus } from "@vinceau/slp-realtime";
import { useDispatch, useSelector } from "react-redux";

import { ConnectionStatusCard } from "@/components/ConnectionStatusCard";
import { streamManager } from "@/lib/realtime";
import { statusToColor, statusToLabel } from "@/lib/status";
import { Dispatch, iRootState } from "@/store";
import { SlippiConnectionPlaceholder } from "../../containers/SlippiConnectionPlaceholder";

import { PageHeader } from "@/components/Form";
import slippiLogo from "@/styles/images/slippi.png";

export const SlippiPage: React.FC = () => {
  const port = useSelector((state: iRootState) => state.slippi.port);
  const slippiConnectionType = useSelector((state: iRootState) => state.tempContainer.slippiConnectionType);
  const status = useSelector((state: iRootState) => state.tempContainer.slippiConnectionStatus);
  const dispatch = useDispatch<Dispatch>();
  const connected = status === ConnectionStatus.CONNECTED;
  const isDolphinConnection = connected && slippiConnectionType === "dolphin";

  const onDisconnect = () => {
    streamManager.disconnectFromSlippi();
  };

  const header = statusToLabel(status);
  const subHeader = isDolphinConnection ? "Slippi Dolphin" : `Relay Port: ${port}`;
  const statusColor = statusToColor(status);
  return (
    <div>
      <PageHeader>Slippi Connection</PageHeader>
      {connected ? (
        <ConnectionStatusCard
          header={header}
          subHeader={subHeader}
          userImage={slippiLogo}
          statusColor={statusColor}
          shouldPulse={connected}
          onDisconnect={onDisconnect}
          buttonText="Disconnect"
        />
      ) : (
        <SlippiConnectionPlaceholder port={port} onClick={dispatch.slippi.connectToSlippi} />
      )}
    </div>
  );
};
