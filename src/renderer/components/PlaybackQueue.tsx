import React from "react";

interface FileInfo {
    path: string;
}

const PlaybackQueueItem: React.FC<{
    file: FileInfo
}> = (props) => {
    return (
        <div>
            {props.file.path}
        </div>
    );
};

export const PlaybackQueue: React.FC<{
    files: FileInfo[];
}> = (props) => {
    return (
        <div>
            {props.files.map((file, i) => (
                <PlaybackQueueItem key={`${i}--${file.path}`} file={file}/>
            ))}
        </div>
    );
};
