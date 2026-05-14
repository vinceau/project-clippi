import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/ui/Button/Button";
import { Icon } from "@/ui/Icon/Icon";

import { DropPad } from "@/components/DropPad";
import { Text } from "@/components/Form";
import { Labelled } from "@/components/Labelled";
import { OBSStatusBar } from "@/containers/OBSStatusBar";
import { saveQueueToFile } from "@/lib/dolphin";
import type { Dispatch, iRootState } from "@/store";

import styles from "./RecorderView.module.css";

export function RecorderView() {
  const { dolphinQueue } = useSelector((state: iRootState) => state.tempContainer);
  const dispatch = useDispatch<Dispatch>();
  const onRemove = (index: number) => {
    dispatch.tempContainer.removeDolphinQueueEntry(index);
  };
  const loadFileHandler = () => {
    dispatch.tempContainer.loadDolphinQueue();
  };
  const droppedFilesHandler = (files: string[]) => {
    dispatch.tempContainer.appendDolphinQueue(files.map((p) => ({ path: p })));
  };
  const addFileHandler = () => {
    dispatch.tempContainer.addFileToDolphinQueue();
  };
  const shuffleQueueHandler = () => {
    dispatch.tempContainer.shuffleDolphinQueue();
  };
  const clearQueueHandler = () => {
    dispatch.tempContainer.resetDolphinQueue();
  };
  const onSaveHandler = () => {
    saveQueueToFile().catch(console.error);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (result: any) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    dispatch.tempContainer.moveDolphinQueueEntry({
      startIndex: source.index,
      endIndex: destination.index,
    });
  };
  const validQueue = dolphinQueue.length > 0;
  return (
    <div className={styles.outer}>
      <div className={styles.content}>
        <h1>
          Playback Queue <Icon name="play circle" />
        </h1>
        <Text margin="none">Create a playlist of replays and load them into Dolphin</Text>
        <div className={styles.toolbar}>
          <div>
            <Button type="button" onClick={loadFileHandler}>
              <Icon name="folder" /> Load JSON
            </Button>
            <Button type="button" disabled={!validQueue} onClick={onSaveHandler}>
              <Icon name="save" /> Save JSON
            </Button>
          </div>
          {validQueue && (
            <div>
              <Labelled title="Add file">
                <Button onClick={addFileHandler} icon="plus" />
              </Labelled>
              <Labelled title="Shuffle queue">
                <Button onClick={shuffleQueueHandler} icon="shuffle" />
              </Labelled>
              <Labelled title="Clear queue">
                <Button onClick={clearQueueHandler} icon="trash" />
              </Labelled>
            </div>
          )}
        </div>
        <div className={styles.mainBody}>
          <DropPad
            id="recorder-drop-pad"
            onDragEnd={onDragEnd}
            onDrop={(files) => droppedFilesHandler(files)}
            files={dolphinQueue}
            onRemove={onRemove}
          />
        </div>
      </div>
      <div className={styles.footer}>
        <OBSStatusBar />
      </div>
    </div>
  );
}
