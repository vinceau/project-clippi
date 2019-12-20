import * as React from "react";
import { connectToSlippi } from "@/lib/realtime";

export const SlippiPage: React.FC = (
) => {
    const [port, setPort] = React.useState("1667");
    const handleConnect = () => {
        const portNum = parseInt(port, 10);
        connectToSlippi(portNum).catch(console.error);
    };
    return (
        <div>
            Port: <input type="text" value={port} onChange={e => setPort(e.target.value)} />
            <button onClick={handleConnect}>Connect to slippi</button>
        </div>
    );
};
