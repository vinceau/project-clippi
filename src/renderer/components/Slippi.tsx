import * as React from "react";

import styled from "styled-components";
import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { slippiLivestream } from "@/lib/realtime";
import { SlippiConnectionStatusCard, SlippiConnectionPlaceholder } from "./ConnectionStatus";
import { ConnectionStatus } from "@vinceau/slp-realtime";

export const SlippiPage: React.FC = () => {
    const { port } = useSelector((state: iRootState) => state.slippi);
    const { slippiConnectionStatus } = useSelector((state: iRootState) => state.tempContainer);
    const dispatch = useDispatch<Dispatch>();

    return (
        <div>
            <h2>Relay Connection</h2>
            {slippiConnectionStatus === ConnectionStatus.CONNECTED ?
                <SlippiConnectionStatusCard
                    status={slippiConnectionStatus}
                    port={port}
                    onDisconnect={() => slippiLivestream.connection.disconnect()}
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