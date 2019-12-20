import * as React from "react";

import { stages as stageUtils } from "slp-parser-js";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { Dispatch, iRootState } from "@/store";
import { TwitchClip, TwitchConnectButton } from "./TwitchConnect";
import { notify } from "../lib/utils";
import { connectToSlippi } from "@/lib/realtime";
import { SlippiPage } from "./Slippi";

const Count = () => {
    const slippiPort = useSelector((state: iRootState) => state.slippi.port);
    const sharks = useSelector((state: iRootState) => state.sharks);
    const authToken = useSelector((state: iRootState) => state.twitch.authToken);
    const dispatch = useDispatch<Dispatch>();

    const Outer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    `;

    const handleClick = () => {
        console.log("notify clicked");
        notify("Notification title", "Notification body");
    };
    const handleConnect = (port: string) => {
        console.log('updating port in redux');
        dispatch.slippi.setPort(port);
        console.log('connecting to port');
        connectToSlippi(parseInt(port, 10)).catch(console.error);
    };

    return (
        <Outer>
            <div style={{ width: 120 }}>
                <h1>Slippi</h1>
                <SlippiPage initialPort={slippiPort} onSubmit={handleConnect} />
            </div>
            <button onClick={handleClick}>notify</button>
            <div style={{ width: 200 }}>
                <h3>Sharks</h3>
                <h1>{sharks}</h1>
                <button onClick={() => dispatch.sharks.increment(1)}>+1</button>
                <button onClick={() => dispatch.sharks.incrementAsync(1)}>
                    Async +1
                </button>
                <button onClick={() => dispatch.twitch.fetchTwitchToken()}>
                    Fetch token
                </button>
            </div>
            <div>
                <p>Best stage is {stageUtils.getStageName(2)}</p>

                <TwitchConnectButton onClick={() => {console.log("button clicked")}} />
            </div>
            {authToken ?
                <TwitchClip accessToken={authToken} />
                :
                <TwitchConnectButton onClick={() => dispatch.twitch.fetchTwitchToken()} />
            }
 </Outer>
    );
};

export const Panel = Count;
