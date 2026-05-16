/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx } from "clsx";
import React, { useCallback } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useDropzone } from "react-dropzone";

import styles from "./DropPad.module.css";
import { PlaybackQueue } from "./PlaybackQueue";
import { PlaybackQueueEmpty } from "./PlaybackQueueEmpty";

export function DropPad({
  id,
  files,
  onDrop: onDropProp,
  onDragEnd,
  onRemove,
}: {
  id: string;
  files: any[];
  onDrop: (files: any) => void;
  onDragEnd: (result: any) => void;
  onRemove?: (index: number) => void;
}) {
  const accept = ".slp";
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onDropProp(acceptedFiles.map((f) => f.path));
  }, []);
  const { open, getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop,
    accept,
    noClick: true,
    noKeyboard: true,
  });
  return (
    <div className={clsx(styles.outer, isDragActive && styles.active)} {...getRootProps()}>
      <input {...getInputProps()} />
      {files.length > 0 ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <PlaybackQueue id={id} files={files} removeFile={onRemove} />
        </DragDropContext>
      ) : (
        <PlaybackQueueEmpty onOpen={open} />
      )}
    </div>
  );
}
