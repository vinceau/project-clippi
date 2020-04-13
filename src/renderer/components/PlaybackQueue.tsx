import React from "react";
import { PlaybackQueueItem } from "./recorder/PlaybackQueueItem";

interface FileInfo {
    path: string;
}

export const PlaybackQueue: React.FC<{
    files: FileInfo[];
    removeFile?: (index: number) => void;
}> = (props) => {
    const removeFile = (index: number, path: string) => {
        console.log(`Removing file at index ${index} with path: ${path}`);
        if (props.removeFile) {
            props.removeFile(index);
        }
    };
    return (
        <div>
            {props.files.map((file, i) => (
                <PlaybackQueueItem key={`${i}--${file.path}`} path={file.path} onRemove={() => removeFile(i, file.path)}/>
            ))}
        </div>
    );
};
