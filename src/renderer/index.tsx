// Import all the styles first since they will be overwritten
import Worker from "worker-loader!./worker";

const worker = new Worker();

worker.postMessage({ a: 1 });
worker.onmessage = (event) => {
  console.log(`got message: ${event}`);
};

worker.addEventListener("message", (event) => {
  console.log(`wooh got a message: ${event}`);
});

import "react-tippy/dist/tippy.css"; // React-tippy styles
import "semantic-ui-css/semantic.min.css"; // Semantic UI styles

import "@/styles/index.scss"; // Our custom styles

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "@/store";
import App from "./containers/App";

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
