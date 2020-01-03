import * as React from "react";

import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

import { Button, Form } from "semantic-ui-react";
import { connectToOBS } from "@/lib/obs";
import { notify } from "@/lib/utils";

export const OBSSettings = () => {
    const { obsAddress, obsPort, obsPassword } = useSelector((state: iRootState) => state.slippi);
    const dispatch = useDispatch<Dispatch>();
    const onSubmit = () => {
        connectToOBS().then(() => {
            notify(`Successfully connected to OBS`);
        }).catch(err => {
            console.error(err);
            notify(`Could not connect to ${obsAddress}:${obsPort}`);
        });
    };

    return (<div>
        <h2>OBS Configuration</h2>
        <div style={{ maxWidth: "500px" }}>
            <Form onSubmit={onSubmit}>
                <Form.Field>
                    <label>IP Address</label>
                    <input
                        placeholder="localhost"
                        value={obsAddress}
                        onChange={(e) => {dispatch.slippi.setOBSAddress(e.target.value)}}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Port</label>
                    <input
                        placeholder="4444"
                        value={obsPort}
                        onChange={(e) => {dispatch.slippi.setOBSPort(e.target.value)}}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Websocket Password</label>
                    <input
                        placeholder="Password"
                        value={obsPassword}
                        onChange={(e) => {dispatch.slippi.setOBSPassword(e.target.value)}}
                    />
                </Form.Field>
                <Button primary type="submit">Connect</Button>
            </Form>
        </div>
    </div>);
};
