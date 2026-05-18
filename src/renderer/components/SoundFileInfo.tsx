import React from "react";
import { Trash } from "lucide-react";

import { Tooltip } from "@/ui/Tooltip/Tooltip";

import styles from "./SoundFileInfo.module.css";

export function SoundFileInfo({
  name,
  path,
  onPathClick,
  onRemove,
}: {
  name: string;
  path: string;
  onPathClick?: () => void;
  onRemove: () => void;
}) {
  return (
    <div className={styles.container}>
      <div>
        <Tooltip title="Open location">
          <h2 onClick={onPathClick}>{name}</h2>
        </Tooltip>
        <div>{path}</div>
      </div>
      <div className={styles.removeButton}>
        <Tooltip title="Remove">
          <Trash size={16} onClick={onRemove} />
        </Tooltip>
      </div>
    </div>
  );
}
