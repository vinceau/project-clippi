import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import CounterContainer from '../containers/CounterContainer';
import TwitchContainer from '../containers/TwitchContainer';

const Application = () => (
    <Router>
        <Switch>
            <Route path="/" exact={true} component={TwitchContainer} />
            <Route path="/counter" component={CounterContainer} />
        </Switch>
    </Router>
);

export default hot(Application);
