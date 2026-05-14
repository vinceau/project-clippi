import { clsx } from "clsx";
import type { DolphinEntry } from "@vinceau/slp-realtime";
import { exists } from "common/utils";
import path from "path";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Icon } from "@/ui/Icon/Icon";

import { Labelled } from "./Labelled";

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
            <Labelled title={`${index + 1}${exists(total) && ` of ${total}`}`}>
              <Icon size="big" name="file outline" />
            </Labelled>
            <div className={styles.detailsContent}>
              <h3>{basename}</h3>
              <span>{dirname}</span>
            </div>
          </div>
          <Labelled title="Remove">
            <div className={styles.removeIcon} onClick={onRemove}>
              <Icon size="large" name="close" />
            </div>
          </Labelled>
        </div>
      )}
    </Draggable>
  );
}
