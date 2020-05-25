import * as React from "react";

import { eventActionManager } from "@/containers/actions";
import { ActionEvent } from "@/lib/realtime";
import { notify } from "@/lib/utils";

export const DevTools = (): JSX.Element => {
  const handleClick = () => {
    console.log("notify clicked");
    notify("Here's a notification", "A notification title");
  };
  const customEvent = () => {
    eventActionManager.emitEvent(ActionEvent.TEST_EVENT).catch(console.error);
  };
  const [sceneName, setSceneName] = React.useState("");
  return (
    <div>
      <input value={sceneName} onChange={(e) => setSceneName(e.target.value)} />
      <button onClick={handleClick}>notify</button>
      <button onClick={customEvent}>trigger test event</button>
    </div>
  );
};
