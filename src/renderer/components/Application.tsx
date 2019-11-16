import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import CounterContainer from '../containers/CounterContainer';
import { TwitchConnect } from './TwitchConnect/TwitchConnect';

const Application = () => (
    <div>
        Hello World from Electron!
        <CounterContainer />
        <TwitchConnect />
    </div>
);

export default hot(Application);
