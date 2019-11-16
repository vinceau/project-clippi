import * as React from 'react';
import { ipcRenderer } from 'electron';
import { IpcTwitchAuthenticate } from '../../../shared/ipcEvents';

require('./TwitchConnect.scss');
const connectImg = require('./connect.png');

export const TwitchConnect: React.SFC<{}> = () => {
    return (
        <div
            onClick={() => {
                console.log('hello world');
                ipcRenderer.send(IpcTwitchAuthenticate, {
                    scope: ['user_read', 'clips:edit']
                });
            }}
        >
            <img src={connectImg} />
        </div>
    );
};
