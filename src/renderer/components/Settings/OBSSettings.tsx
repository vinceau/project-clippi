import * as React from "react";

import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

import { connectToOBSAndNotify, disconnectFromOBS } from "@/lib/obs";
import { Button, Form } from "semantic-ui-react";
import { ConnectionStatusCard } from "../Misc/ConnectionStatus";

import OBSLogo from "@/styles/images/obs.png";

export const OBSSettings = () => {
    const { obsAddress, obsPort, obsPassword } = useSelector((state: iRootState) => state.slippi);
    const { obsConnected } = useSelector((state: iRootState) => state.tempContainer);
    const dispatch = useDispatch<Dispatch>();
    const header = obsConnected ? "Connected" : "Disconnected";
    const color = obsConnected ? "#00E461" : "#F30807";
    const subHeader = `${obsAddress}:${obsPort}`;

    return (<div>
        <h2>OBS Configuration</h2>
        {obsConnected ?
            <ConnectionStatusCard
                header={header}
                subHeader={subHeader}
                userImage={OBSLogo}
                statusColor={color}
                onDisconnect={disconnectFromOBS}
                shouldPulse={obsConnected}
            />
            :
            <div style={{ maxWidth: "500px" }}>
                <Form onSubmit={connectToOBSAndNotify}>
                    <Form.Field>
                        <label>IP Address</label>
                        <input
                            placeholder="localhost"
                            value={obsAddress}
                            onChange={(e) => { dispatch.slippi.setOBSAddress(e.target.value) }}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Port</label>
                        <input
                            placeholder="4444"
                            value={obsPort}
                            onChange={(e) => { dispatch.slippi.setOBSPort(e.target.value) }}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Websocket Password</label>
                        <input
                            placeholder="Password"
                            value={obsPassword}
                            onChange={(e) => { dispatch.slippi.setOBSPassword(e.target.value) }}
                        />
                    </Form.Field>
                    <Button primary type="submit">Connect</Button>
                </Form>
            </div>
        }
    </div>);
};
