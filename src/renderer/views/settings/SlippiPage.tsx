import { ConnectionStatus } from "@slippi/slippi-js";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { ConnectionStatusCard } from "@/components/ConnectionStatusCard";
import { PageHeader } from "@/components/Form";
import { SlippiConnectionPlaceholder } from "@/containers/SlippiConnectionPlaceholder";
import { streamManager } from "@/lib/realtime";
import { statusToColor, statusToLabel } from "@/lib/status";
import type { Dispatch, iRootState } from "@/store";
import slippiLogo from "@/styles/images/slippi.png";

export const SlippiPage: React.FC = () => {
  const relayAddress = useSelector((state: iRootState) => state.slippi.relayAddress);
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
        <SlippiConnectionPlaceholder
          address={relayAddress}
          port={port}
          onClick={({ address, port }) => dispatch.slippi.connectToSlippi({ address, port })}
        />
      )}
    </div>
  );
};
