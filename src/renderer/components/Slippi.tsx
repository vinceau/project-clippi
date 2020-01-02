import * as React from "react";

import styled from "styled-components";
import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { slippiLivestream } from "@/lib/realtime";
import { SlippiConnectionStatusCard } from "./ConnectionStatus";

export const SlippiPage: React.FC = (props: any) => {
    const { port } = useSelector((state: iRootState) => state.slippi);
    const { slippiConnectionStatus } = useSelector((state: iRootState) => state.tempContainer);
    const dispatch = useDispatch<Dispatch>();

    const HeaderContainer = styled.header`
        flex: 0 1 auto;
        background-color: #F9FAFB;
        border-bottom: 1px solid #d4d4d5;
    `;
    const Inner = styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    return (
        <SlippiConnectionStatusCard
            status={slippiConnectionStatus}
            port={port}
            onConnect={() => dispatch.slippi.connectToSlippi(port)}
            onDisconnect={() => slippiLivestream.connection.disconnect()}
            onPortChange={dispatch.slippi.setPort}
        />
    );
};