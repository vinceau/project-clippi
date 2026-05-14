/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from "@emotion/styled";
import React, { useCallback } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useDropzone } from "react-dropzone";

import { PlaybackQueue } from "./PlaybackQueue";
import { PlaybackQueueEmpty } from "./PlaybackQueueEmpty";

const Outer = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  &&:after {
    content: "";
    background-color: white;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    opacity: 0.95;
    z-index: -1;
  }
`;

export const DropPad = ({
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
}) => {
  const accept = ".slp";
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onDropProp(acceptedFiles.map((f) => f.path));
  }, []);
  const { open, getRootProps, getInputProps /*, isDragActive */ } = useDropzone({
    multiple: true,
    onDrop,
    accept,
    noClick: true,
    noKeyboard: true,
  });
  return (
    <Outer {...getRootProps()}>
      <input {...getInputProps()} />
      {files.length > 0 ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <PlaybackQueue id={id} files={files} removeFile={onRemove} />
        </DragDropContext>
      ) : (
        <PlaybackQueueEmpty onOpen={open} />
      )}
    </Outer>
  );
};
