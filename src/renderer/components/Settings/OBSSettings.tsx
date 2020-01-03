import * as React from "react";

import { Button, Form } from "semantic-ui-react";

export const OBSSettings = () => {
    return (<div>
        <h2>OBS Configuration</h2>
        <div style={{ maxWidth: "500px" }}>
            <Form>
                <Form.Field>
                    <label>IP Address</label>
                    <input placeholder="localhost" />
                </Form.Field>
                <Form.Field>
                    <label>Port</label>
                    <input placeholder="4444" />
                </Form.Field>
                <Form.Field>
                    <label>Websocket Password</label>
                    <input placeholder="Password" />
                </Form.Field>
                <Button type="submit">Connect</Button>
            </Form>
        </div>
    </div>);
};
