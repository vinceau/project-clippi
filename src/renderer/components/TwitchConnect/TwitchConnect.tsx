import * as React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { ipcRenderer } from 'electron';
// import { IpcTwitchAuthenticate } from '../../../shared/ipcEvents';
import { createTwitchClip, currentUser, isStreaming } from '../../../shared/twitch';
import { HelixUser } from 'twitch';
import { iRootState, Dispatch } from '../../store';

require('./TwitchConnect.scss');
const connectImg = require('./connect.png');

// interface TwitchConnectProps {
//     accessToken: string | null;
// }

const TwitchUserStatus: React.SFC<{ user: HelixUser; live: boolean }> = props => {
    const status = props.live ? 'live' : 'offline';
    return (
        <div className="twitch--user--status--container">
            <img src={props.user.profilePictureUrl} />
            <div className={`twitch--status ${status}`}>{status}</div>
        </div>
    );
};

const TwitchClip: React.SFC<{ accessToken: string }> = props => {
    const [name, setName] = React.useState('');
    const [live, setLive] = React.useState(false);
    const [user, setUser] = React.useState<HelixUser | null>(null);
    const handleClip = async () => {
        const clip = await createTwitchClip(props.accessToken, name);
        console.log(`clip: ${clip}`);
    };

    const handleStatus = async () => {
        const userIsLive = await isStreaming(props.accessToken, name);
        console.log(`${name} is live? ${userIsLive}`);
    };

    const checkUser = async () => {
        const u = await currentUser(props.accessToken);
        setUser(u);
    };

    const checkStatus = async () => {
        console.log('checking status');
        const isLive = await isStreaming(props.accessToken);
        console.log(`status: ${isLive}`);
        setLive(isLive);
    };

    React.useEffect(() => {
        checkUser();
        checkStatus();
    }, [props, live]);

    return (
        <div>
            {user && <TwitchUserStatus user={user} live={live} />}
            <button
                onClick={() => {
                    checkStatus();
                }}
            >
                Refresh Status
            </button>
            <form>
                <label>
                    Twitch broadcaster ID:
                    <input type="text" value={name} onChange={e => setName(e.target.value)} />
                </label>
                <button
                    onClick={(e: any) => {
                        e.preventDefault();
                        handleClip();
                    }}
                >
                    clip
                </button>
                <button
                    onClick={(e: any) => {
                        e.preventDefault();
                        handleStatus();
                    }}
                >
                    status
                </button>
            </form>
        </div>
    );
};

export const TwitchConnect: React.SFC<{}> = props => {
    const accessToken = useSelector((state: iRootState) => state.twitch.authToken);
    const dispatch = useDispatch<Dispatch>();
    const authenticate = () => {
        const scopes = ['user_read', 'clips:edit'];
        dispatch.twitch.fetchTwitchToken(scopes);
        // ipcRenderer.send(IpcTwitchAuthenticate, {
        //     scope: ['user_read', 'clips:edit']
        // });
    };
    return (
        <div>
            {!accessToken ? (
                <div onClick={authenticate}>
                    <img src={connectImg} />
                </div>
            ) : (
                <TwitchClip accessToken={accessToken} />
            )}
        </div>
    );
};
