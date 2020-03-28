import * as React from "react";

import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Icon } from "semantic-ui-react";

import { ConnectionStatusCard } from "@/components/ConnectionStatusCard";
import { connectToOBSAndNotify, obsConnection, OBSConnectionStatus } from "@/lib/obs";
import { Dispatch, iRootState } from "@/store";

import OBSLogo from "@/styles/images/obs.png";

export const OBSSettings = () => {
    const { obsAddress, obsPort, obsPassword } = useSelector((state: iRootState) => state.slippi);
    const [obsConnected, setOBSConnected] = React.useState(false);
    const dispatch = useDispatch<Dispatch>();
    const header = obsConnected ? "Connected" : "Disconnected";
    const color = obsConnected ? "#00E461" : "#F30807";
    const subHeader = `${obsAddress}:${obsPort}`;
    const [showPass, setShowPass] = React.useState(false);
    const togglePass = () => {
        setShowPass(!showPass);
    };

    React.useEffect(() => {
        const sub = obsConnection.connectionStatus$.subscribe(status => {
            setOBSConnected(status === OBSConnectionStatus.CONNECTED);
        });
        return () => sub.unsubscribe();
    }, []);

    return (<div>
        <h2>OBS Configuration</h2>
        {obsConnected ?
            <ConnectionStatusCard
                header={header}
                subHeader={subHeader}
                userImage={OBSLogo}
                statusColor={color}
                onDisconnect={() => obsConnection.disconnect()}
                shouldPulse={obsConnected}
            />
            :
            <div style={{ maxWidth: "500px" }}>
                <Form onSubmit={connectToOBSAndNotify}>
                    <Form.Field>
                        <label>IP Address</label>
                        <Form.Input
                            placeholder="localhost"
                            value={obsAddress}
                            onChange={(e) => { dispatch.slippi.setOBSAddress(e.target.value); }}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Port</label>
                        <Form.Input
                            placeholder="4444"
                            value={obsPort}
                            onChange={(e) => { dispatch.slippi.setOBSPort(e.target.value); }}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Websocket Password</label>
                        <Form.Input
                            icon={<Icon name="eye" link={true} onClick={togglePass} />}
                            type={showPass ? "text" : "password"}
                            placeholder="Password"
                            value={obsPassword}
                            onChange={(e) => { dispatch.slippi.setOBSPassword(e.target.value); }}
                        />
                    </Form.Field>
                    <Button primary type="submit">Connect</Button>
                </Form>
            </div>
        }
    </div>);
};
