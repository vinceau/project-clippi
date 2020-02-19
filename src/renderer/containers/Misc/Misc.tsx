import * as React from "react";

import { eventActionManager } from "@/actions";
import { connectToOBS, setScene } from "@/lib/obs";
import { ActionEvent } from "@/lib/realtime";
import { isDevelopment } from "@/lib/utils";
import { notify } from "../../lib/utils";

export const DevTools = () => {
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
            <button onClick={() => setScene(sceneName).catch(console.error)}>change obs scene</button>
            <button onClick={() => connectToOBS().catch(console.error)}>connect to obs</button>
            <button onClick={handleClick}>notify</button>
            <button onClick={customEvent}>trigger test event</button>
        </div>
    );
};

export const CodeBlock: React.FC<{
    values: any
}> = (props) => {
    if (isDevelopment) {
        return (<pre style={{overflowX: "auto"}}>{(JSON as any).stringify(props.values, 0, 2)}</pre>);
    }
    return null;
};
