import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Main } from './Main/Main';

const Application = () => (
    <Router>
        <Main />
    </Router>
);

export default hot(Application);
