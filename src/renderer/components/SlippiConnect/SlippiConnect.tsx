import * as React from 'react';
import { connectToSlippi, listPathFiles, checkSlippiConnectionStatus } from '../../lib/events';

// require('./SlippiConnect.scss');

export const SlippiConnect: React.FC<{}> = props => {
    const [port, setPort] = React.useState('');
    const handleConnect = async () => {
        const portNum = parseInt(port, 10);
        connectToSlippi(portNum);
    };

    const handleListFiles = async () => {
        listPathFiles('./');
    };

    const checkStatus = async () => {
        await checkSlippiConnectionStatus();
    };

    return (
        <div>
            <input type="text" onChange={e => setPort(e.target.value)} />
            <button onClick={() => handleConnect()}>Connect</button>
            <button onClick={() => handleListFiles()}>List Files</button>
            <button onClick={() => checkStatus()}>Check Status</button>
        </div>
    );
};
