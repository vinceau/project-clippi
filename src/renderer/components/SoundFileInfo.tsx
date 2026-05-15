import React from "react";
import { Trash } from "lucide-react";

import { Labelled } from "./Labelled";

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
        <Labelled title="Open location">
          <h2 onClick={onPathClick}>{name}</h2>
        </Labelled>
        <div>{path}</div>
      </div>
      <div className={styles.removeButton}>
        <Labelled title="Remove">
          <Trash size={16} onClick={onRemove} />
        </Labelled>
      </div>
    </div>
  );
}
