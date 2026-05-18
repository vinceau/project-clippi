import React from "react";
import { Button } from "@/ui/Button/Button";

import styles from "./PlaybackQueueEmpty.module.css";
import { SlippiIcon } from "./SlippiIcon";

export function PlaybackQueueEmpty({ onOpen }: { onOpen?: () => void }) {
  return (
    <div className={styles.outer}>
      <SlippiIcon style={{ width: "64px", height: "64px" }} />
      <div className={styles.notice}>
        <h2>No files added</h2>
        <p>Drag and drop SLP files here to add them to the queue</p>
      </div>
      <Button onClick={onOpen}>Select files</Button>
    </div>
  );
}
