import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import styled from "styled-components";

const Outer = styled.div`
min-height: 200px;
max-height: 400px;
width: 100%;
border: solid 1px white;
display: flex;
align-items: center;
justify-content: center;
border-radius: 5px;
cursor: pointer;
`;

export const DropPad: React.FC<{
    onFiles: (files: any) => void;
}> = (props) => {
    const onDrop = useCallback(acceptedFiles => {
        props.onFiles(acceptedFiles);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
    return (
        <Outer {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
            }
        </Outer>
    );
};
