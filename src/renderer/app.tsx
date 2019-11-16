import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { PersistGate } from 'redux-persist/integration/react';

import Application from './components/Application';
import { store, persistor } from './store';

import './lib/events';

// Create main element
const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

// Render components
const render = (Component: () => JSX.Element) => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Component />
                </PersistGate>
            </Provider>
        </AppContainer>,
        mainElement
    );
};

render(Application);
