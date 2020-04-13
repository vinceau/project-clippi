import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import styled from "styled-components";
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

export const DropPad: React.FC<{
    files: any[];
    onDrop: (files: any) => void;
    onRemove?: (index: number) => void;
}> = (props) => {
    const accept = ".slp";
    const onDrop = useCallback((acceptedFiles: File[]) => {
        props.onDrop(acceptedFiles.map(f => f.path));
    }, []);
    const { open, getRootProps, getInputProps /*, isDragActive */ } = useDropzone({ multiple: true, onDrop, accept, noClick: true, noKeyboard: true });
    return (
        <Outer {...getRootProps()}>
            <input {...getInputProps()} />
            {
                props.files.length > 0 ?
                    <PlaybackQueue files={props.files} removeFile={props.onRemove} /> :
                    <PlaybackQueueEmpty onOpen={open}/>
            }
        </Outer>
    );
};
