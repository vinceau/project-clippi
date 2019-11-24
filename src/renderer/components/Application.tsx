import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';

// import { SlippiConnect } from './SlippiConnect/SlippiConnect';
import { TwitchConnect } from './TwitchConnect/TwitchConnect';

const Main: React.FC<{}> = () => {
    return (
        <div>
            <TwitchConnect />
        </div>
    );
};

const Application = () => (
    <Router>
        <Switch>
            <Route path="/" exact={true} component={Main} />
        </Switch>
    </Router>
);

export default hot(Application);
