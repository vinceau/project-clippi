import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "@/store";
import App from "./containers/App";

import { ThemeManager } from "./styles";

// tslint:disable-next-line: no-import-side-effect
import "./styles";

const rootEl = document.getElementById("app");

const render = (Component: any) =>
  ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeManager>
            <Component />
          </ThemeManager>
        </PersistGate>
    </Provider>,
    rootEl
  );

render(App);