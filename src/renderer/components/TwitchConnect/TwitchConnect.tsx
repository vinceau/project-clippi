import * as React from 'react';
import { ipcRenderer } from 'electron';
import { IpcTwitchAuthenticate } from '../../../shared/ipcEvents';
import { createTwitchClip } from '../../../shared/twitch';

require('./TwitchConnect.scss');
const connectImg = require('./connect.png');

interface TwitchConnectProps {
    accessToken: string | null;
}

export const TwitchConnect: React.SFC<TwitchConnectProps> = props => {
    const [name, setName] = React.useState('');
    const authenticate = () => {
        ipcRenderer.send(IpcTwitchAuthenticate, {
            scope: ['user_read', 'clips:edit']
        });
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (props.accessToken) {
            const clip = await createTwitchClip(props.accessToken, name);
            console.log(`clip: ${clip}`);
        }
    };
    return (
        <div>
            {!props.accessToken ? (
                <div onClick={authenticate}>
                    <img src={connectImg} />
                </div>
            ) : (
                <div>
                    <p>Twitch access token: {props.accessToken}</p>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Twitch broadcaster ID:
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            )}
        </div>
    );
};
