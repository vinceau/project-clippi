import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Main } from './Main/Main';

const Application = () => (
    <Router>
        <Switch>
            <Route path="/" exact={true} component={Main} />
        </Switch>
    </Router>
);

export default hot(Application);
