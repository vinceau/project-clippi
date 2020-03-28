import React from "react";

import { Button, Checkbox } from "semantic-ui-react";

import { loadFileInDolphin } from "@/lib/utils";

export const RecorderView = () => {
    const [record, setRecord] = React.useState(false);
    return (
        <div>
            <h1>Game Recorder</h1>
            <div>
                <Checkbox
                    label="Record output in OBS"
                    checked={record}
                    onChange={(_, data) => setRecord(Boolean(data.checked))}
                />
            </div>
            <div>
                <Button type="button" onClick={() => loadFileInDolphin(record).catch(console.error)}>
                    Load a file into Dolphin
            </Button>
            </div>
        </div>
    );
};
