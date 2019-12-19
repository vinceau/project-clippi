import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "@/store";
import { App } from "./components/App";

import * as models from "./models";

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    document.getElementById("app")
);

// Hot reloading
if (module.hot) {
  // Reload rematch models
    module.hot.accept("./models", () => {
    Object.keys(models).forEach(modelKey => {
      console.log(`Reloading model ${modelKey}`);
      store.model({
        name: modelKey,
        ...models[modelKey]
      });
    });
  });
}
