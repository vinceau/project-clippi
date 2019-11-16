import * as React from 'react';
import { ipcRenderer } from 'electron';
import { IpcTwitchAuthenticate } from '../../../shared/ipcEvents';

require('./TwitchConnect.scss');
const connectImg = require('./connect.png');

interface TwitchConnectProps {
    accessToken: string | null;
}

export const TwitchConnect: React.SFC<TwitchConnectProps> = props => {
    return (
        <div>
            <p>Twitch access token: {props.accessToken}</p>
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
        </div>
    );
};
