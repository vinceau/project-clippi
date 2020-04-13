import React from "react";
import { PlaybackQueueItem } from "./recorder/PlaybackQueueItem";

interface FileInfo {
    path: string;
}

export const PlaybackQueue: React.FC<{
    files: FileInfo[];
}> = (props) => {
    return (
        <div>
            {props.files.map((file, i) => (
                <PlaybackQueueItem key={`${i}--${file.path}`} path={file.path}/>
            ))}
        </div>
    );
};
