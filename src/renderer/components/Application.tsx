import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import CounterContainer from '../containers/CounterContainer';
import TwitchContainer from '../containers/TwitchContainer';

const Application = () => (
    <div>
        Hello World from Electron!
        <CounterContainer />
        <TwitchContainer />
    </div>
);

export default hot(Application);
