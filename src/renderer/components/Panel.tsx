import * as React from "react";

import { stages as stageUtils } from "slp-parser-js";

import { useDispatch, useSelector } from "react-redux";

import { Dispatch, iRootState } from "@/store";
import { TwitchClip, TwitchConnectButton } from "./TwitchConnect";
import styled from "styled-components";
import { notify } from "../lib/utils";

const Count = () => {
    const dolphins = useSelector((state: iRootState) => state.dolphins);
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
    return (
        <Outer>
            <div style={{ width: 120 }}>
                <h3>Dolphins</h3>
                <h1>{dolphins}</h1>
                <button onClick={dispatch.dolphins.increment}>+1</button>
                <button onClick={dispatch.dolphins.incrementAsync}>Async +1</button>
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
