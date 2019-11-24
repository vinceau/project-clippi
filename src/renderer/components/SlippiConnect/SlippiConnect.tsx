import * as React from 'react';
import { connectToSlippi, listPathFiles, checkSlippiConnectionStatus } from '../../lib/events';
import { useSelector } from 'react-redux';
import { iRootState } from '../../store';

// require('./SlippiConnect.scss');

export const SlippiConnect: React.FC<{}> = props => {
    const status = useSelector((state: iRootState) => state.slippi.connectionStatus);
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
            <h1>connection status: {status}</h1>
            <input type="text" onChange={e => setPort(e.target.value)} />
            <button onClick={() => handleConnect()}>Connect</button>
            <button onClick={() => handleListFiles()}>List Files</button>
            <button onClick={() => checkStatus()}>Check Status</button>
        </div>
    );
};
