import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export const DropPad: React.FC<{
    onFiles: (files: any) => void;
}> = (props) => {
    const onDrop = useCallback(acceptedFiles => {
        props.onFiles(acceptedFiles);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
            }
        </div>
    );
};
