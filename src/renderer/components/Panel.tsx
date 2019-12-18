import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Dispatch, iRootState } from "@/store";

const Count = () => {
    const dolphins = useSelector((state: iRootState) => state.dolphins);
    const sharks = useSelector((state: iRootState) => state.sharks);
    const authToken = useSelector((state: iRootState) => state.twitch.authToken);
	const dispatch = useDispatch<Dispatch>();
	const scopes = ["user_read", "clips:edit"];

    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ width: 120 }}>
                <h3>Dolphins</h3>
                <h1>{dolphins}</h1>
                <button onClick={dispatch.dolphins.increment}>+1</button>
                <button onClick={dispatch.dolphins.incrementAsync}>Async +1</button>
            </div>
            <div style={{ width: 200 }}>
                <h3>Sharks</h3>
                <h1>{sharks}</h1>
                <button onClick={() => dispatch.sharks.increment(1)}>+1</button>
                <button onClick={() => dispatch.sharks.incrementAsync(1)}>
                    Async +1
                </button>
                <button onClick={() => dispatch.twitch.fetchTwitchToken(scopes)}>
                    Fetch token
                </button>
            </div>
            <p>Using Rematch Models</p>
			<p>{authToken}</p>
        </div>
    );
};

export const Panel = Count;
