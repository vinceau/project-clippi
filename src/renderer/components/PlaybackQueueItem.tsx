import { clsx } from "clsx";
import type { DolphinEntry } from "@vinceau/slp-realtime";
import { exists } from "common/utils";
import path from "path";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { X as CloseIcon, File as FileIcon } from "lucide-react";

import { Tooltip } from "@/ui/Tooltip/Tooltip";

import styles from "./PlaybackQueueItem.module.css";

export function PlaybackQueueItem({
  index,
  file,
  onRemove,
  total,
}: {
  index: number;
  total?: number;
  file: DolphinEntry;
  onRemove?: () => void;
}) {
  const basename = path.basename(file.path);
  const dirname = path.dirname(file.path);
  return (
    <Draggable draggableId={JSON.stringify(file)} index={index}>
      {(provided: any, snapshot: any) => (
        <div
          className={clsx(styles.outer, snapshot.isDragging && styles.dragging)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className={styles.details}>
            <Tooltip title={`${index + 1}${exists(total) && ` of ${total}`}`}>
              <FileIcon size={24} />
            </Tooltip>
            <div className={styles.detailsContent}>
              <h3>{basename}</h3>
              <span>{dirname}</span>
            </div>
          </div>
          <Tooltip title="Remove">
            <div className={styles.removeIcon} onClick={onRemove}>
              <CloseIcon size={24} />
            </div>
          </Tooltip>
        </div>
      )}
    </Draggable>
  );
}
