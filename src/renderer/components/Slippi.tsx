import * as React from "react";

export const SlippiPage: React.FC<{
    initialPort: string
    onSubmit: (port: string) => void;
}> = props => {
    const [port, setPort] = React.useState(props.initialPort);
    const handleConnect = () => {
        props.onSubmit(port);
    };
    return (
        <div>
            Port: <input type="text" value={port} onChange={e => setPort(e.target.value)} />
            <button onClick={handleConnect}>Connect to slippi</button>
        </div>
    );
};
