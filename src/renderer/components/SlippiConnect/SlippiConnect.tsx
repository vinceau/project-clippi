import * as React from 'react';
import { connectToSlippi, listPathFiles } from '../../lib/events';

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

    return (
        <div>
            <input type="text" onChange={e => setPort(e.target.value)} />
            <button onClick={() => handleConnect()}>Connect</button>
            <button onClick={() => handleListFiles()}>List Files</button>
        </div>
    );
};
