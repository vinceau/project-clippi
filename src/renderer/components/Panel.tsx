import * as React from "react";

import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { eventActionManager } from "@/lib/actions";
import { ActionEvent, connectToSlippi } from "@/lib/realtime";
import { Dispatch, iRootState } from "@/store";
import { notify } from "../lib/utils";
import { Automator } from "./Automator/Automator";
import { SlippiPage } from "./Slippi";
import { TwitchClip, TwitchConnectButton } from "./TwitchConnect";

const Count = () => {
    const slippiPort = useSelector((state: iRootState) => state.slippi.port);
    const { authToken } = useSelector((state: iRootState) => state.twitch);
    const dispatch = useDispatch<Dispatch>();

    const Outer = styled.div`
    `;

    const handleClick = () => {
        console.log("notify clicked");
        notify("Notification title", "Notification body");
    };
    const handleConnect = (port: string) => {
        console.log("updating port in redux");
        dispatch.slippi.setPort(port);
        console.log("connecting to port");
        connectToSlippi(parseInt(port, 10)).catch(console.error);
    };
    const customEvent = () => {
        eventActionManager.emitEvent(ActionEvent.TEST_EVENT).catch(console.error);
    };
    return (
        <Outer>
            <Automator />
            <div style={{ width: 120 }}>
                <h1>Slippi</h1>
                <SlippiPage initialPort={slippiPort} onSubmit={handleConnect} />
            </div>
            <button onClick={handleClick}>notify</button>
            <button onClick={customEvent}>custom event</button>
            {authToken ?
                <TwitchClip accessToken={authToken} />
                :
                <TwitchConnectButton onClick={() => dispatch.twitch.fetchTwitchToken()} />
            }
        </Outer>
    );
};

export const Panel = Count;
