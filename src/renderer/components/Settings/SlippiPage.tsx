import * as React from "react";

import { streamManager } from "@/lib/realtime";
import { Dispatch, iRootState } from "@/store";
import { ConnectionStatus } from "@vinceau/slp-realtime";
import { useDispatch, useSelector } from "react-redux";
import { SlippiConnectionPlaceholder, SlippiConnectionStatusCard } from "../Misc/ConnectionStatus";

export const SlippiPage: React.FC = () => {
    const { port } = useSelector((state: iRootState) => state.slippi);
    const { slippiConnectionStatus, currentSlpFolderStream } = useSelector((state: iRootState) => state.tempContainer);
    const dispatch = useDispatch<Dispatch>();
    const relayConnected = slippiConnectionStatus === ConnectionStatus.CONNECTED;
    const isFolderStream = currentSlpFolderStream !== "";
    const connected = relayConnected || isFolderStream;
    return (
        <div>
            <h2>Slippi Connection</h2>
            {connected ?
                (
                    relayConnected ?
                        <SlippiConnectionStatusCard
                            status={slippiConnectionStatus}
                            port={port}
                            onDisconnect={() => streamManager.disconnectFromSlippi()}
                        />
                        :
                        <p>hello</p>
                )
                :
                <SlippiConnectionPlaceholder
                    port={port}
                    onClick={dispatch.slippi.connectToSlippi}
                />
            }
        </div>
    );
};
