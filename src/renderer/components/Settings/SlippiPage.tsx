import * as React from "react";

import { streamManager } from "@/lib/realtime";
import { Dispatch, iRootState } from "@/store";
import { ConnectionStatus } from "@vinceau/slp-realtime";
import { useDispatch, useSelector } from "react-redux";
import { SlippiConnectionPlaceholder, SlippiConnectionStatusCard } from "../Misc/ConnectionStatus";

export const SlippiPage: React.FC = () => {
    const { port } = useSelector((state: iRootState) => state.slippi);
    const { slippiConnectionStatus } = useSelector((state: iRootState) => state.tempContainer);
    const dispatch = useDispatch<Dispatch>();

    return (
        <div>
            <h2>Slippi Relay</h2>
            {slippiConnectionStatus === ConnectionStatus.CONNECTED ?
                <SlippiConnectionStatusCard
                    status={slippiConnectionStatus}
                    port={port}
                    onDisconnect={() => streamManager.disconnectFromSlippi()}
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
