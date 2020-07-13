// Import all the styles first since they will be overwritten
import "react-tippy/dist/tippy.css"; // React-tippy styles
import "react-toastify/dist/ReactToastify.min.css"; // Toast styles
import "semantic-ui-css/semantic.min.css"; // Semantic UI styles
import "react-reflex/styles.css";

import "@/styles/index.scss"; // Our custom styles

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "@/store";
import App from "./containers/App";

const rootEl = document.getElementById("app");

const render = (Component: any) =>
  // eslint-disable-next-line react/no-render-return-value
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component />
      </PersistGate>
    </Provider>,
    rootEl
  );

render(App);
