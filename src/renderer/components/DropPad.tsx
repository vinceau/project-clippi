import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "semantic-ui-react";

import styled from "styled-components";
import { CustomIcon } from "./CustomIcon";
import { PlaybackQueue } from "./PlaybackQueue";
import { PlaybackQueueEmpty } from "./PlaybackQueueEmpty";
import slippiLogoSVG from "@/styles/images/slippi-logo.svg";

const Outer = styled.div`
min-height: 200px;
max-height: 400px;
width: 100%;
border: solid 1px white;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
border-radius: 5px;
position: relative;
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
}> = (props) => {
    const accept = ".slp";
    const onDrop = useCallback((acceptedFiles: File[]) => {
        props.onDrop(acceptedFiles.map(f => f.path));
    }, []);
    const { open, getRootProps, getInputProps /*, isDragActive */ } = useDropzone({ multiple: true, onDrop, accept, noClick: true, noKeyboard: true });
    return (
        <Outer {...getRootProps()}>
            <input {...getInputProps()} />
            <Button type="button" onClick={open}>
                <CustomIcon image={slippiLogoSVG} />
                Select
            </Button>
            {
                props.files.length > 0 ?
                <PlaybackQueue files={props.files}/> :
                <PlaybackQueueEmpty />
            }
        </Outer>
    );
};
