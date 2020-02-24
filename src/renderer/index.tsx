import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "@/store";
import App from "./containers/App";

// React-tippy styles
import "react-tippy/dist/tippy.css";

// Semantic UI styles
import "semantic-ui-css/semantic.min.css";

import "@/styles/index.scss";

const rootEl = document.getElementById("app");

const render = (Component: any) =>
  ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component />
        </PersistGate>
    </Provider>,
    rootEl
  );

render(App);