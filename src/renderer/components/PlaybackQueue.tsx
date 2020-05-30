import { DolphinEntry } from "@vinceau/slp-realtime";
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { PlaybackQueueItem } from "./PlaybackQueueItem";

export const PlaybackQueue: React.FC<{
  id: string;
  files: DolphinEntry[];
  removeFile?: (index: number) => void;
}> = (props) => {
  const removeFile = (index: number, path: string) => {
    console.log(`Removing file at index ${index} with path: ${path}`);
    if (props.removeFile) {
      props.removeFile(index);
    }
  };
  return (
    <Droppable droppableId={props.id}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {props.files.map((file, i) => (
            <PlaybackQueueItem
              key={JSON.stringify(file)}
              file={file}
              index={i}
              total={props.files.length}
              onRemove={() => removeFile(i, file.path)}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
