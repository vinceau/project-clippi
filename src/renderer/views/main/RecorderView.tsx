import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/ui/Button/Button";
import { Plus, Save, Shuffle, Trash, CirclePlay, Folder } from "lucide-react";

import { DropPad } from "@/components/DropPad";
import { Tooltip } from "@/ui/Tooltip/Tooltip";
import { OBSStatusBar } from "@/containers/OBSStatusBar";
import { saveQueueToFile } from "@/lib/dolphin";
import type { Dispatch, iRootState } from "@/store";

import styles from "./RecorderView.module.css";
import { Header } from "./Header/Header";

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
        <Header
          title="Playback Queue"
          icon={<CirclePlay />}
          description="Create a playlist of replays and load them into Dolphin"
        />
        <div className={styles.toolbar}>
          <Button type="button" onClick={loadFileHandler}>
            <Folder /> Load JSON
          </Button>
          <Button type="button" disabled={!validQueue} onClick={onSaveHandler}>
            <Save /> Save JSON
          </Button>
          {validQueue && (
            <div>
              <Tooltip title="Add file">
                <Button onClick={addFileHandler}>
                  <Plus size={20} />
                </Button>
              </Tooltip>
              <Tooltip title="Shuffle queue">
                <Button onClick={shuffleQueueHandler}>
                  <Shuffle size={20} />
                </Button>
              </Tooltip>
              <Tooltip title="Clear queue">
                <Button onClick={clearQueueHandler}>
                  <Trash size={20} />
                </Button>
              </Tooltip>
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
