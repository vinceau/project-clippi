import type { DolphinEntry } from "@vinceau/slp-realtime";
import React from "react";
import { Droppable } from "react-beautiful-dnd";

import { PlaybackQueueItem } from "./PlaybackQueueItem";

export function PlaybackQueue({
  id,
  files,
  removeFile: removeFileProp,
}: {
  id: string;
  files: DolphinEntry[];
  removeFile?: (index: number) => void;
}) {
  const removeFile = (index: number, path: string) => {
    console.log(`Removing file at index ${index} with path: ${path}`);
    if (removeFileProp) {
      removeFileProp(index);
    }
  };
  return (
    <Droppable droppableId={id}>
      {(provided: any) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {files.map((file, i) => (
            <PlaybackQueueItem
              key={JSON.stringify(file)}
              file={file}
              index={i}
              total={files.length}
              onRemove={() => removeFile(i, file.path)}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
